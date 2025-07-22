import type { Socket } from "socket.io-client";

import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocketStore = defineStore("socketio", () => {
    const socket = ref<Socket | null>(null);
    const authStore = useAuthStore();

    async function init() {
        if (socket?.value?.connected) {
            return;
        }

        const token = await authStore.getOneTimeToken();

        socket.value = io({
            auth: {
                token,
            },
            autoConnect: true,
        });

        socket.value.on("connect", () => {
            console.log("Connected to server");
        });

        socket.value.on("connect_error", (error) => {
            console.error("Connection failed:", error.message);
        });

        socket.value.connect();
    }

    const disconnect = () => {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
        }
    };

    const emit = (event: string, data: any) => {
        if (!socket?.value?.connected) {
            throw new Error("Socket not connected");
        }
        socket.value.emit(event, data);
    };

    const on = (event: string, callback: (...args: any[]) => void) => {
        if (!socket.value) {
            throw new Error("Socket not initialized");
        }
        socket.value.on(event, callback);
    };

    const off = (event: string, callback?: (...args: any[]) => void) => {
        if (!socket.value)
            return;
        socket.value.off(event, callback);
    };

    return {
        init,
        disconnect,
        emit,
        on,
        off,
        get connected() {
            return socket?.value?.connected ?? false;
        },
    };
});
