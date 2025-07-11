import type { NitroApp } from "nitropack";
import type { IncomingMessage } from "node:http";
import type { ExtendedError } from "socket.io";

import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { Server } from "socket.io";

import type { InsertMessage } from "~/lib/db/schema";
import type { UserWithId } from "~/lib/types";

import { auth } from "~/lib/auth";
import { findChannel } from "~/lib/db/queries/channel";
import { findMember } from "~/lib/db/queries/member";
import { findServerWithChannels } from "~/lib/db/queries/server";
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
            console.log(token);
            if (!token) {
                return next(new Error("Unauthentication."));
            }

            const requestHeaders = new Headers();
            requestHeaders.set("Authorization", `Bearer ${token}`);

            // Verify token with Better Auth
            const session = await auth.api.getSession({
                headers: requestHeaders,
            });
            console.log(session);
            if (!session) {
                return next(new Error("Invalid token"));
            }

            // Attach user info to socket
            socket.user = session.user as unknown as UserWithId;
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
        socket.on("join-server", async (serverId: number) => {
            try {
                const userId = socket.user?.id;
                if (!userId)
                    return;

                const server = await findServerWithChannels(serverId);

                if (!server) {
                    socket.emit("error", { message: "Server not found" });
                    return;
                }

                const member = await findMember(userId, serverId);

                if (!member) {
                    socket.emit("error", { message: "Unauthorized server access" });
                    return;
                }

                // Join server
                socket.join(`server:${serverId}`);

                // Join channels
                for (const channel of server.channels) {
                    socket.join(`channel:${channel.id}`);
                }

                console.log(`User ${userId} joined server ${serverId}`);
            }
            catch (error) {
                console.log("SOCKET ERROR JOIN SERVER EVENT: ", error);
                socket.emit("error", { message: "Failed to join server" });
            }
        });
        // Leave server
        socket.on("leave-server", async (serverId: number) => {
            try {
                const userId = socket.user?.id;
                if (!userId)
                    return;

                const server = await findServerWithChannels(serverId);

                if (!server) {
                    socket.emit("error", { message: "Server not found" });
                    return;
                }

                const member = await findMember(userId, serverId);

                if (!member) {
                    socket.emit("error", { message: "Unauthorized server access" });
                    return;
                }

                socket.leave(`server:${serverId}`);

                for (const channel of server.channels) {
                    socket.leave(`channel:${channel.id}`);
                }

                console.log(`User ${socket.user?.id} left server ${serverId}`);
            }
            catch (error) {
                console.log("SOCKET ERROR LEAVE SERVER EVENT: ", error);
                socket.emit("error", { message: "Failed to leave server" });
            }
        });

        // Send message to channel
        socket.on("send-message", async (data: InsertMessage & {
            channelId: number;
        }) => {
            try {
                console.log("send message", data.content);
                const user = socket.user;
                if (!user)
                    return;

                const { channelId, content } = data;

                // Verify the channel belongs to the specified server
                const channel = await findChannel(channelId);
                if (!channel) {
                    socket.emit("error", { message: "Channel not found " });
                    return;
                }

                // Create message object
                const message: InsertMessage = {
                    content,
                };

                await $fetch(`api/channels/${channelId}/send-message`, {
                    method: "POST",

                });

                // Broadcast message only to users in the specific channel
                io.to(`channel:${channelId}`).emit("message", {
                    ...message,
                    sender: {
                        id: user.id,
                        name: user.name,
                        avatar: user.image,
                    },
                });

                console.log(`Message sent in channel ${channelId} by user ${user.name}`);
            }
            catch (error) {
                console.log(error);
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
