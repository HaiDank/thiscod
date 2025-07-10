import type { NitroApp } from "nitropack";
import type { IncomingMessage } from "node:http";

import { Server as Engine } from "engine.io";
import { defineEventHandler } from "h3";
import { Server } from "socket.io";

import type { UserWithId } from "~/lib/types";

import { auth } from "~/lib/auth";
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
                return next(new Error("Authentication token missing"));
            }

            const requestHeaders = new Headers();
            requestHeaders.set("Authorization", `Bearer ${token}`);

            // Verify token with Better Auth
            const session = await auth.api.getSession({
                headers: requestHeaders,
            });

            if (!session) {
                return next(new Error("Invalid token"));
            }

            // Attach user info to socket
            socket.user = session.user as unknown as UserWithId;
            next();
        }
        catch (error) {
            next(error);
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("message", (data) => {
            console.log("Message received:", data);
            // Broadcast to all clients
            io.emit("message", data);
        });

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
