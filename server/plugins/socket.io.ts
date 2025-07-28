import type { NitroApp } from "nitropack";
import type { IncomingMessage } from "node:http";
import type { ExtendedError } from "socket.io";

import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { Server } from "socket.io";

import type { SelectChannel, SelectMessageWithUser, SelectServer } from "~/lib/db/schema";
import type { UserWithId } from "~/lib/types";

import { auth } from "~/lib/auth";
import { findMember } from "~/lib/db/queries/member";
import { findServerWithChannelsAndMembers } from "~/lib/db/queries/server";
import env from "~/lib/env";

export default defineNitroPlugin((nitroApp: NitroApp) => {
    const engine = new Engine();
    const io = new Server({
        cors: {
            origin: env.BETTER_AUTH_URL,
            credentials: true,
        },
    });

    io.bind(engine);

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Unauthenticated."));
            }

            // Verify token with Better Auth
            const res = await auth.api.verifyOneTimeToken({
                body: {
                    token,
                },
            });
            if (!res) {
                return next(new Error("Invalid token"));
            }

            // Attach user info to socket
            socket.user = res.user as unknown as UserWithId;
            next();
        }
        catch (e) {
            const error = e as ExtendedError;
            next(error);
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id, "User:", socket.user?.name);

        // Join user to their server channels
        socket.on("join-server", async (server: SelectServer) => {
            try {
                const userId = socket.user?.id;
                if (!userId)
                    return;

                if (!server) {
                    socket.emit("error", { message: "Server not found" });
                    return;
                }

                const member = await findMember(userId, server.id);

                if (!member) {
                    socket.emit("error", { message: "Unauthorized server access" });
                    return;
                }

                // Join server
                socket.join(`server:${server.id}`);

                console.log(`User ${userId} joined server ${server.id}`);
            }
            catch (error) {
                console.error("SOCKET ERROR JOIN SERVER EVENT: ", error);
                socket.emit("error", { message: "Failed to join server" });
            }
        });
        // Leave server
        socket.on("leave-server", async (server: SelectServer) => {
            try {
                socket.leave(`server:${server.id}`);

                console.log(`User ${socket.user?.id} left server ${server.id}`);
            }
            catch (error) {
                console.error("SOCKET ERROR LEAVE SERVER EVENT: ", error);
                socket.emit("error", { message: "Failed to leave server" });
            }
        });

        // Join Channels
        socket.on("join-channels", async (channel: SelectChannel) => {
            try {
                const userId = socket.user?.id;
                if (!userId)
                    return;

                const server = await findServerWithChannelsAndMembers(channel.serverId);

                if (!server) {
                    socket.emit("error", { message: "Server not found" });
                    return;
                }

                const member = server.members.find(member => member.userId === userId);

                if (!member) {
                    socket.emit("error", { message: "Unauthorized server access" });
                    return;
                }

                socket.join(`channel:${channel.id}`);
                console.log(`User ${userId} joined channel ${channel.id}`);
            }
            catch (error) {
                console.error("SOCKET ERROR JOIN CHANNELS EVENT: ", error);
                socket.emit("error", { message: "Failed to join channels" });
            }
        });

        // Leave channels
        socket.on("leave-channels", async (channelId: number) => {
            try {
                socket.leave(`channel:${channelId}`);
            }
            catch (error) {
                console.error("SOCKET ERROR LEAVE SERVER EVENT: ", error);
                socket.emit("error", { message: "Failed to leave server" });
            }
        });

        // Send message to channel
        socket.on("send-message", async (data: { msg: SelectMessageWithUser; channelId: number; serverId: number }) => {
            try {
                const user = socket.user;
                if (!user)
                    return;
                const { msg, channelId, serverId } = data;
                // Broadcast message only to users in the specific channel
                io.to(`channel:${channelId}`).emit("message", msg);

                io.to(`server:${serverId}`).emit("notification", msg);

                console.log(`Message sent in channel ${channelId} by user ${user.name}`);
            }
            catch (error) {
                console.error(error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // // User typing indicator
        // socket.on("typing-start", async (data: { channelId: string }) => {
        //   const userId = socket.user?.id;
        //   if (!userId) return;

        //   const canAccess = await canUserAccessChannel(userId, data.channelId);
        //   if (!canAccess) return;

        //   socket.to(`channel:${data.channelId}`).emit("user-typing", {
        //     userId,
        //     channelId: data.channelId,
        //     isTyping: true,
        //   });
        // });

        // socket.on("typing-stop", async (data: { channelId: string }) => {
        //   const userId = socket.user?.id;
        //   if (!userId) return;

        //   const canAccess = await canUserAccessChannel(userId, data.channelId);
        //   if (!canAccess) return;

        //   socket.to(`channel:${data.channelId}`).emit("user-typing", {
        //     userId,
        //     channelId: data.channelId,
        //     isTyping: false,
        //   });
        // });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    nitroApp.router.use("/socket.io/", defineEventHandler({
        handler(event) {
            // Create a proper Engine.IO request object
            const req = event.node.req as IncomingMessage & {
                _query: Record<string, string>;
                url: string;
            };

            // Parse query parameters from URL
            const url = new URL(req.url || "", `http://${req.headers.host}`);
            req._query = Object.fromEntries(url.searchParams.entries());

            engine.handleRequest(req, event.node.res);
            event._handled = true;
        },
        websocket: {
            open(peer) {
                // @ts-expect-error private method and property
                engine.prepare(peer._internal.nodeReq);
                // @ts-expect-error private method and property
                engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
            },
        },
    }));
});
