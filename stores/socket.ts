import type { Socket } from "socket.io-client";

import { defineStore } from "pinia";
import { io } from "socket.io-client";

import type { SelectChannel, SelectServer } from "~/lib/db/schema";

export const useSocketStore = defineStore("socketio", () => {
    const authStore = useAuthStore();
    const serverStore = useServerStore();
    const socket = ref<Socket | null>(null);
    const isConnected = ref(false);
    const currentRoom = ref<string | null>(null);
    const rooms = ref<Set<string>>(new Set());
    const initializationPromise = ref<Promise<void> | null>(null);

    async function init() {
        if (isConnected.value) {
            console.log("socket already connected");
            return;
        }

        // Return existing promise if initialization is in progress
        if (initializationPromise.value) {
            return initializationPromise.value;
        }
        // Create new initialization promise
        initializationPromise.value = _init();
        await initializationPromise.value;
        initializationPromise.value = null;
    }

    async function _init() {
        if (isConnected.value) {
            return;
        }
        console.log("Initializing socket!");

        try {
            const token = await authStore.getOneTimeToken();

            socket.value = io({
                auth: {
                    token,
                },
                autoConnect: true,
            });

            setupEventListeners();
        }
        catch (error) {
            console.error("Socket initialization failed:", error);
            throw error;
        }
    }

    function setupEventListeners() {
        if (!socket.value)
            return;

        socket.value.on("connect", () => {
            isConnected.value = true;
            console.log("Connected to Socket.IO server");
        });

        socket.value.on("disconnect", () => {
            isConnected.value = false;
            console.log("Disconnected from Socket.IO server");
        });

        serverStore.servers?.forEach((server) => {
            joinServerRoom(server.server);
        });

        // socket.value.on("notification", (notification) => {
        //     notifications.value.push(notification);

        //     // Show browser notification
        //     if (typeof window !== "undefined" && "Notification" in window) {
        //         if (Notification.permission === "granted") {
        //             new Notification("New Message", {
        //                 body: notification.message,
        //             });
        //         }
        //     }
        // });
    };

    const disconnect = () => {
        if (socket.value) {
            // Leave all rooms on disconnect
            serverStore.servers?.forEach((server) => {
                socket.value?.emit("leave-server", server);
            });

            socket.value.disconnect();
            socket.value = null;
        }
        isConnected.value = false;
        currentRoom.value = null;
    };

    const emit = (event: string, data: any) => {
        if (socket?.value?.connected) {
            socket.value.emit(event, data);
        }
    };

    const on = (event: string, callback: (...args: any[]) => void) => {
        if (socket.value) {
            socket.value.on(event, callback);
        }
    };

    const off = (event: string, callback?: (...args: any[]) => void) => {
        if (!socket.value)
            return;
        if (callback) {
            socket.value.off(event, callback);
        }
        else {
            socket.value.off(event);
        }
    };

    // Join room  (server-side join)
    async function joinServerRoom(server: SelectServer) {
        const roomString = `server:${server.id}`;
        if (rooms.value.has(roomString))
            return;

        try {
            rooms.value.add(roomString);
            socket.value?.emit("join-server", server);
        }
        catch (error) {
            console.error("Failed to join room :", error);
        }
    };

    // Leave room  (server-side leave)
    async function leaveServerRoom(server: SelectServer) {
        const roomString = `server:${server.id}`;
        try {
            if (!rooms.value.has(roomString))
                return;
            rooms.value.delete(roomString);
            socket.value?.emit("leave-server", server);
        }
        catch (error) {
            console.error("Failed to leave room :", error);
        }
    }

    function joinChannelRoom(channel: SelectChannel) {
        try {
            socket.value?.emit("join-channels", channel);
            console.log("joined channel room:", channel.id);
        }
        catch (error) {
            console.error("Failed to join room :", error);
        }
        finally {
            rooms.value.add(`channel:${channel.id}`);
        }
    }

    function leaveChannelRoom(channelId: number) {
        try {
            socket.value?.emit("leave-channels", channelId);
            console.log("left channel room:", channelId);
        }
        catch (error) {
            console.error("Failed to leave room :", error);
        }
        finally {
            rooms.value.delete(`channel:${channelId}`);
        }
    }

    function removeEventListeners() {
        if (socket.value) {
            socket.value.off("connect");
            socket.value.off("disconnect");
            socket.value.off("message");
            socket.value.off("notification");
        }
    }

    return {
        init,
        disconnect,
        emit,
        on,
        off,
        isConnected,
        joinChannelRoom,
        joinServerRoom,
        leaveServerRoom,
        leaveChannelRoom,
        removeEventListeners,
        get connected() {
            return socket?.value?.connected ?? false;
        },
    };
});
