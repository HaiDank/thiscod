import type { InsertMessage, PaginationRequest, SelectConversationWithUsers, SelectDirectMessageWithUser } from "~/lib/db/schema";
import type { ClientMessageType, UserWithId } from "~/lib/types";

export const useConversationStore = defineStore("useConversationStore", () => {
    const route = useRoute();
    const socketStore = useSocketStore();
    const authStore = useAuthStore();
    const toast = useToast();
    const conversationUrlWithId = computed(() => `/api/conversations/${route.params.conversation}`);

    const api = computed(() => `/api/messages/direct/${route.params.conversation}`);
    const pagination = ref<PaginationRequest>({
        limit: 25,
        cursor: undefined,
    });
    const msgCount = ref(0);
    const cacheKey = computed(() => `messages-direct-${route.params.conversation}-cursor-${pagination.value.cursor ?? 0}`);
    const {
        data,
        status: messagesStatus,
        refresh: refreshMessages,
    } = useFetch(api, {
        key: cacheKey,
        lazy: true,
        immediate: false,
        watch: false,
        query: pagination,
        transform(data: { messages: SelectDirectMessageWithUser[]; count: number }) {
            msgCount.value = data.count;
            if (data.messages.length > 0) {
                return processMessagesForClient(data.messages);
            }
            else {
                return [];
            }
        },
    });

    const {
        data: conversations,
        status: conversationsStatus,
        refresh: refreshConversations,
        error,
    } = useFetch("/api/conversations", {
        lazy: true,
    });

    const {
        data: currentConversation,
        status: currentConversationStatus,
        refresh: refreshCurrentConversation,
    } = useFetch<SelectConversationWithUsers>(conversationUrlWithId, {
        lazy: true,
        watch: false,
        immediate: false,
    });

    const processedMessagesKey = ref<Set<number>>(new Set());
    const messages = ref<ClientMessageType[]>([]);
    const hasNext = computed(() => messages.value.length < msgCount.value);

    function resetState() {
        messages.value = [];
        pagination.value.cursor = undefined;
        processedMessagesKey.value = new Set();
    }

    function ClientMessageBuilder(curr: SelectDirectMessageWithUser, prevCreatedAt?: number | null, prevUserId?: number | null, pending?: boolean): ClientMessageType {
        let isConnected = false;
        if ((prevUserId && Number(prevUserId) === Number(curr.userId)) && (prevCreatedAt && curr.createdAt - prevCreatedAt <= 7 * 60 * 1000)) { // considered connected when sent within 5 minutes of each other and of the same sender
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
            isConnected,
            pending,
        };
        return clientMsg;
    }

    function processMessagesForClient(msgArray: SelectDirectMessageWithUser[]): ClientMessageType[] {
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

    const sendMessage = async (data: InsertMessage, conversationId: number, csrf: string) => {
        if (!authStore.user)
            return;
        const now = Date.now();
        const msg: SelectDirectMessageWithUser = {
            id: now,
            createdAt: now,
            updatedAt: now,
            content: data.content ?? null,
            file: data.file ?? null,
            edited: false,
            conversationId,
            userId: Number(authStore.user.id),
            user: authStore.user as unknown as UserWithId,
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
            async onResponse({ response }) {
                messages.value[0].pending = false;
                if (socketStore.isConnected) {
                    socketStore.emit("send-direct-message", {
                        msg: response._data,
                        conversationId,
                    });
                }
            },
        });

        return res;
    };

    async function init() {
        await socketStore.init();
        if (socketStore.isConnected && currentConversation.value) {
            resetState();
            socketStore.joinConversationRoom(currentConversation.value);
            socketStore.on("message", (data: SelectDirectMessageWithUser) => {
                const clientMsg = ClientMessageBuilder(data, messages.value[0].createdAt, messages.value[0].user.id);
                messages.value.unshift(clientMsg);
            });

            await refreshMessages();
        }
    }

    function leaveRoom() {
        if (currentConversation.value) {
            socketStore.leaveConversationRoom(currentConversation.value.id);
            resetState();
        }
        socketStore.off("message");
    }

    return {
        init,
        leaveRoom,
        sendMessage,
        api,
        pagination,
        data,
        messages,
        messagesStatus,
        refreshMessages,
        fetchNextMessages,
        conversations,
        conversationsStatus,
        refreshConversations,
        currentConversation,
        currentConversationStatus,
        refreshCurrentConversation,
        cacheKey,
        error,
        hasNext,
    };
});
