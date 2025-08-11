import type { Socket } from "socket.io-client";

import { defineStore } from "pinia";
import { io } from "socket.io-client";

import type { SelectChannel, SelectConversation, SelectServer } from "~/lib/db/schema";

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

        // Return if initialization is in progress
        if (!initializationPromise.value) {
            initializationPromise.value = _init();
        }

        return initializationPromise.value;
    }

    async function _init() {
        if (isConnected.value) {
            return;
        }

        try {
            const token = await authStore.getOneTimeToken();

            socket.value = io({
                auth: {
                    token,
                },
                autoConnect: true,
            });

            await setupEventListeners();
        }
        catch (error) {
            console.error("Socket initialization failed:", error);
            throw error;
        }
    }

    function setupEventListeners() {
        return new Promise<void>((resolve) => {
            socket.value?.on("connect", () => {
                isConnected.value = true;
                console.log("Connected to Socket.IO server");
                resolve();
            });

            socket.value?.on("disconnect", () => {
                isConnected.value = false;
                console.log("Disconnected from Socket.IO server");
                initializationPromise.value = null;
            });

            serverStore.servers?.forEach((server) => {
                joinServerRoom(server.server);
            });
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
                socket.value?.emit("leave-server", server.server.id);
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
    async function leaveServerRoom(serverId: number) {
        const roomString = `server:${serverId}`;
        try {
            if (rooms.value.has(roomString)) {
                rooms.value.delete(roomString);
            }
            socket.value?.emit("leave-server", serverId);
            console.log("leaving server room:", roomString);
        }
        catch (error) {
            console.error("Failed to leave room :", error);
        }
    }

    function joinChannelRoom(channel: SelectChannel) {
        try {
            socket.value?.emit("join-channels", channel);
            console.log("joining channel room:", channel.id);
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

    function joinConversationRoom(conversation: SelectConversation) {
        try {
            socket.value?.emit("join-conversation", conversation);
            console.log("joining conversation room:", conversation.id);
        }
        catch (error) {
            console.error("Failed to join room :", error);
        }
        finally {
            rooms.value.add(`conversation:${conversation.id}`);
        }
    }

    function leaveConversationRoom(conversationId: number) {
        try {
            socket.value?.emit("leave-conversation", conversationId);
            console.log("left conversation room:", conversationId);
        }
        catch (error) {
            console.error("Failed to leave room :", error);
        }
        finally {
            rooms.value.delete(`conversation:${conversationId}`);
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
        joinConversationRoom,
        leaveConversationRoom,
        removeEventListeners,
        rooms,
        get connected() {
            return socket?.value?.connected ?? false;
        },
    };
});
