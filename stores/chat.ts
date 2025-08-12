import type { InsertMessage, PaginationRequest, SelectMessage, SelectMessageWithUser } from "~/lib/db/schema";
import type { ClientMessageType } from "~/lib/types";

export const useChatStore = defineStore("useChatStore", () => {
    const route = useRoute();
    const socketStore = useSocketStore();
    const serverStore = useServerStore();
    const authStore = useAuthStore();
    const toast = useToast();

    const api = computed(() => `/api/messages/${route.params.server}/${route.params.channel}`);
    const pagination = ref<PaginationRequest>({
        limit: 25,
        cursor: undefined,
    });
    const msgCount = ref(0);
    const cacheKey = computed(() => `messages-${route.params.server}-${route.params.channel}-cursor-${pagination.value.cursor ?? 0}`);
    const {
        status: messagesStatus,
        refresh: refreshMessages,
    } = useFetch(api, {
        key: cacheKey,
        lazy: true,
        immediate: false,
        watch: false,
        query: pagination,
        transform(data: { messages: SelectMessageWithUser[]; count: number }) {
            msgCount.value = data.count;
            if (data.messages.length > 0) {
                return processMessagesForClient(data.messages);
            }
            else {
                return [];
            }
        },
    });

    const processedMessagesKey = ref<Set<number>>(new Set());

    const messages = ref<ClientMessageType[]>([]);
    const hasNext = computed(() => messages.value.length < msgCount.value);

    const currentChatId = ref<number | undefined>(serverStore.currentChannel?.id);

    function resetState() {
        messages.value = [];
        pagination.value.cursor = undefined;
        currentChatId.value = undefined;
        processedMessagesKey.value = new Set();
    }

    function reprocessMessagesAfterDelete(data: SelectMessage) {
        for (let i = 0; i < messages.value.length; i++) {
            if (messages.value[i].id === data.id) {
                // if has prev msg
                if (i > 0) {
                    if (i !== messages.value.length) {
                        let isConnected = false;
                        if ((data.userId && Number(data.userId) === Number(messages.value[i - 1].user.id)) && (data.createdAt && messages.value[i - 1].createdAt - data.createdAt <= 5 * 60 * 1000)) {
                            isConnected = true;
                        }
                        messages.value[i - 1].isConnected = isConnected;
                    }
                    else {
                        messages.value[i - 1].isConnected = true;
                    }
                }
                messages.value.splice(i, 1);
                return;
            }
        }
    }
    function reprocessMessagesAfterEdit(data: SelectMessage) {
        for (let i = 0; i < messages.value.length; i++) {
            if (messages.value[i].id === data.id) {
                messages.value[i] = {
                    ...messages.value[i],
                    content: data.content,
                    edited: true,
                    updatedAt: data.updatedAt,
                };
                return;
            }
        }
    }

    function deleteMessage(data: SelectMessage) {
        reprocessMessagesAfterDelete(data);

        socketStore.emit("delete-message", data);
    }

    function editMessage(data: SelectMessage) {
        reprocessMessagesAfterEdit(data);

        socketStore.emit("edit-message", data);
    }

    function ClientMessageBuilder(curr: SelectMessageWithUser, prevCreatedAt?: number | null, prevUserId?: number | null, pending?: boolean): ClientMessageType {
        let isConnected = false;
        if ((prevUserId && Number(prevUserId) === Number(curr.userId)) && (prevCreatedAt && curr.createdAt - prevCreatedAt <= 5 * 60 * 1000)) { // considered connected when sent within 5 minutes of each other and of the same sender
            isConnected = true;
        }
        const clientMsg: ClientMessageType = {
            content: curr.content,
            file: curr.file,
            createdAt: curr.createdAt,
            updatedAt: curr.updatedAt,
            edited: curr.edited,
            user: curr.user,
            id: curr.id,
            type: "channel",
            isConnected,
            pending,
        };
        return clientMsg;
    }

    function processMessagesForClient(msgArray: SelectMessageWithUser[]): ClientMessageType[] {
        for (let i = 0; i < msgArray.length - 1; i++) {
            if (!processedMessagesKey.value.has(msgArray[i].createdAt)) {
                const prev = msgArray[i + 1];
                const curr = msgArray[i];

                const clientMsg = ClientMessageBuilder(curr, prev.createdAt, prev.userId);
                processedMessagesKey.value.add(clientMsg.createdAt);
                messages.value.push(clientMsg);
            }
        }

        if (!processedMessagesKey.value.has(msgArray[msgArray.length - 1].createdAt)) {
            const lastMsg = ClientMessageBuilder(msgArray[msgArray.length - 1]);
            messages.value.push(lastMsg);
            processedMessagesKey.value.add(lastMsg.createdAt);
        }
        return messages.value;
    }

    async function fetchNextMessages() {
        if (messages.value && messages.value.length > 0) {
            pagination.value.cursor = messages.value[messages.value.length - 1].createdAt;
        }
        else {
            pagination.value.cursor = undefined;
        }
        await refreshMessages();
    }

    const sendMessage = async (data: InsertMessage, channelId: number, serverId: number, csrf: string) => {
        if (!authStore.user)
            return;
        const now = Date.now();
        const msg: SelectMessageWithUser = {
            id: now,
            createdAt: now,
            updatedAt: now,
            content: data.content ?? null,
            file: data.file ?? null,
            edited: false,
            channelId,
            userId: Number(authStore.user.id),
            user: authStore.user,
        };

        const originalMessages = messages.value;

        const res = await $fetch(api.value, {
            method: "POST",
            body: data,
            headers: {
                "csrf-token": csrf,
            },
            onRequest() {
                // process the message and add it to the begining of the array
                const clientMsg = ClientMessageBuilder(msg, messages.value[0]?.createdAt, messages.value[0]?.user.id, true);
                messages.value.unshift(clientMsg);
            },
            onResponseError(error) {
                messages.value = originalMessages;
                toast.add({
                    title: "Fail to send message",
                    description: error.response._data.message,
                    color: "error",
                });
            },
            onResponse({ response }) {
                messages.value[0].pending = false;
                if (socketStore.isConnected) {
                    socketStore.emit("send-message", {
                        msg: { ...response._data, user: authStore.user },
                        channelId,
                        serverId,
                    });
                }
            },
        });

        return res;
    };

    async function init() {
        await socketStore.init();
        if (socketStore.isConnected && serverStore.currentChannel) {
            resetState();
            socketStore.joinChannelRoom(serverStore.currentChannel);
            currentChatId.value = serverStore.currentChannel.id;
            socketStore.on("message", (data: SelectMessageWithUser) => {
                const clientMsg = ClientMessageBuilder(data, messages.value[0].createdAt, messages.value[0].user.id);
                messages.value.unshift(clientMsg);
            });

            socketStore.on("message-editted", (data: SelectMessage) => {
                reprocessMessagesAfterEdit(data);
            });

            socketStore.on("message-deleted", (data: SelectMessage) => {
                reprocessMessagesAfterDelete(data);
            });

            await refreshMessages();
        }
    }

    function leaveRoom() {
        if (currentChatId.value) {
            socketStore.leaveChannelRoom(currentChatId.value);
            resetState();
        }
        socketStore.off("message");
    }

    return {
        init,
        leaveRoom,
        sendMessage,
        pagination,
        messages,
        messagesStatus,
        refreshMessages,
        fetchNextMessages,
        hasNext,
        editMessage,
        deleteMessage,
    };
});
