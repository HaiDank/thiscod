export function useChatMessages() {
    const route = useRoute();
    const socketStore = useSocketStore();
    const serverStore = useServerStore();
    const activeRoom = ref<{
        channelId: number;
        serverId: number;
    } | null>(null);
    const messages = ref<{
        content: string;
        sender?: {
            id: string;
            name: string;
            avatar: string;
        };
    }[]>([{
        content: "first message",
    }]);

    const setActiveRoom = (room: {
        channelId: number;
        serverId: number;
    } | null) => {
        activeRoom.value = room;
    };

    const sendMessage = (content: string) => {
        if (activeRoom.value && socketStore.isConnected) {
            socketStore.emit("send-message", {
                content,
                channelId: activeRoom.value.channelId,
                serverId: activeRoom.value.serverId,
            });
        }
    };

    // set active room on route change
    watchEffect(
        async () => {
            if (route.params.server && route.params.channel && socketStore.isConnected) {
                // if (!z.coerce.number().safeParse(route.params.server).success) {
                //     await navigateTo({ name: "channels-me" });
                // }
                // if (!z.coerce.number().safeParse(route.params.channel).success) {
                //     await navigateTo({ name: "channels-server", params: {
                //         server: route.params.server,
                //     } });
                // }
                setActiveRoom({
                    channelId: Number(route.params.channel),
                    serverId: Number(route.params.server),
                });
            }
        },
    );

    onMounted(async () => {
        await socketStore.init();

        if (socketStore.isConnected && serverStore.currentServer) {
            setActiveRoom({
                channelId: Number(route.params.channel),
                serverId: Number(route.params.server),
            });
            socketStore.joinChannelRoom(serverStore.currentServer);
            socketStore.on("message", (data: {
                content: string;
                sender?: {
                    id: string;
                    name: string;
                    avatar: string;
                };
            }) => {
                messages.value.push(data);
            });
        }
    });

    onUnmounted(() => {
        setActiveRoom(null);
        socketStore.off("message");
    });

    return {
        ...socketStore,
        sendMessage,
        messages,
    };
}
