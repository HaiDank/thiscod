import { customAlphabet } from "nanoid";

import type { InsertMessage, SelectMessage, SelectMessageWithUser } from "~/lib/db/schema";
import type { UserWithId } from "~/lib/types";

export const useChatStore = defineStore("useChatStore", () => {
    const route = useRoute();
    const socketStore = useSocketStore();
    const serverStore = useServerStore();
    const authStore = useAuthStore();
    const toast = useToast();

    const api = computed(() => `/api/messages/${route.params.server}/${route.params.channel}`);

    const {
        status: messagesStatus,
        refresh: refreshMessages,
    } = useFetch<SelectMessage[]>(api, {
        lazy: true,
        key: api.value,
    });

    const { data: messages } = useNuxtData<SelectMessageWithUser[]>(api.value);

    const currentChatId = ref<number | undefined>(serverStore.currentChannel?.id);

    const sendMessage = async (data: InsertMessage, channelId: number, serverId: number, csrf: string) => {
        if (!authStore.user)
            return;
        const now = Date.now();
        const msgId = customAlphabet("1234567890", 22);
        const msg: SelectMessageWithUser = {
            id: Number(msgId),
            createdAt: now,
            updatedAt: now,
            content: data.content ?? null,
            file: data.file ?? null,
            edited: false,
            channelId,
            userId: Number(authStore.user.id),
            sender: authStore.user as unknown as UserWithId,
        };

        const originalMessages = messages.value;

        if (socketStore.isConnected) {
            socketStore.emit("send-message", {
                msg,
                channelId,
                serverId,
            });
        }
        const res = await $fetch(api.value, {
            method: "POST",
            body: data,
            headers: {
                "csrf-token": csrf,
            },
            onRequest() {
                messages.value?.push(msg);
            },
            onResponseError(error) {
                messages.value = originalMessages;
                toast.add({
                    title: "Fail to send message",
                    description: error.response._data.message,
                    color: "error",
                });
            },
            async onResponse() {
                // Invalidate todos in the background if the request succeeded.
                await refreshNuxtData(api.value);
            },
        });

        return res;
    };

    async function init() {
        await socketStore.init();
        console.log("initialize store", socketStore.isConnected, serverStore.currentChannel, messages.value);
        if (socketStore.isConnected && serverStore.currentChannel) {
            socketStore.joinChannelRoom(serverStore.currentChannel);
            currentChatId.value = serverStore.currentChannel.id;
            socketStore.on("message", (data: SelectMessageWithUser) => {
                if (messages.value) {
                    messages.value.push(data);
                }
                else {
                    messages.value = [data];
                }
            });
        }
    }

    function leaveRoom() {
        if (currentChatId.value) {
            socketStore.leaveChannelRoom(currentChatId.value);
        }
        socketStore.off("message");
    }

    return {
        init,
        leaveRoom,
        sendMessage,
        messages,
        messagesStatus,
        refreshMessages,
    };
});
