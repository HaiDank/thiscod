import type { Socket } from "socket.io-client";

import { io } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
    const authStore = useAuthStore();
    const { token } = authStore;

    const connect = () => {
        if (!token) {
            throw new Error("No authentication token available");
        }

        if (socket?.connected) {
            return socket;
        }

        socket = io({
            auth: {
                token,
            },
            autoConnect: false,
        });

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("connect_error", (error) => {
            console.error("Connection failed:", error.message);
        });

        socket.connect();
        return socket;
    };

    const disconnect = () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    };

    const emit = (event: string, data: any) => {
        if (!socket?.connected) {
            throw new Error("Socket not connected");
        }
        socket.emit(event, data);
    };

    const on = (event: string, callback: (...args: any[]) => void) => {
        if (!socket) {
            throw new Error("Socket not initialized");
        }
        socket.on(event, callback);
    };

    const off = (event: string, callback?: (...args: any[]) => void) => {
        if (!socket)
            return;
        socket.off(event, callback);
    };

    return {
        connect,
        disconnect,
        emit,
        on,
        off,
        get connected() {
            return socket?.connected ?? false;
        },
    };
}
