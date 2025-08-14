import type { InsertMessage, PaginationRequest, SelectConversationWithOtherUser, SelectDirectMessage, SelectDirectMessageWithUser } from "~/lib/db/schema";
import type { ClientMessageType } from "~/lib/types";

export const useConversationStore = defineStore("useConversationStore", () => {
    const route = useRoute();
    const socketStore = useSocketStore();
    const authStore = useAuthStore();
    const sidebarStore = useSidebarStore();
    const toast = useToast();
    const conversationUrlWithId = computed(() => `/api/conversations/${route.params.id}`);

    const pagination = ref<PaginationRequest>({
        limit: 25,
        cursor: undefined,
    });
    const msgCount = ref(0);
    const api = computed(() => `/api/messages/direct/${route.params.id}`);
    const cacheKey = computed(() => `messages-direct-${route.params.id}-cursor-${pagination.value.cursor ?? 0}`);
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
    } = useFetch("/api/conversations", {
        lazy: true,
    });

    const {
        data: currentConversation,
        status: currentConversationStatus,
        refresh: refreshCurrentConversation,
    } = useFetch<SelectConversationWithOtherUser>(conversationUrlWithId, {
        lazy: true,
        immediate: false,
        watch: false,
    });

    const processedMessagesKey = ref<Set<number>>(new Set());
    const messages = ref<ClientMessageType[]>([]);
    const hasNext = computed(() => messages.value.length < msgCount.value);

    function resetState() {
        messages.value = [];
        pagination.value.cursor = undefined;
        processedMessagesKey.value = new Set();
    }

    function reprocessMessagesAfterDelete(data: SelectDirectMessage) {
        for (let i = 0; i < messages.value.length; i++) {
            if (messages.value[i].id === data.id) {
                // if has prev msg
                if (i > 0) {
                    if (i !== messages.value.length - 1) {
                        let isConnected = false;
                        if ((data.userId && Number(messages.value[i + 1].user.id) === Number(messages.value[i - 1].user.id)) && (messages.value[i + 1].createdAt && messages.value[i - 1].createdAt - messages.value[i + 1].createdAt <= 5 * 60 * 1000)) {
                            isConnected = true;
                        }
                        messages.value[i - 1].isConnected = isConnected;
                    }
                    else {
                        messages.value[i - 1].isConnected = false;
                    }
                }
                messages.value.splice(i, 1);
                return;
            }
        }
    }
    function reprocessMessagesAfterEdit(data: SelectDirectMessage) {
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

    function deleteMessage(data: SelectDirectMessage) {
        reprocessMessagesAfterDelete(data);
        socketStore.emit("delete-direct-message", data);
    }

    function editMessage(data: SelectDirectMessage) {
        messages.value.forEach((msg, index) => {
            if (msg.id === data.id) {
                messages.value[index].content = data.content;
                messages.value[index].updatedAt = data.updatedAt;
                messages.value[index].edited = true;
            }
        });

        socketStore.emit("edit-direct-message", data);
    }

    function ClientMessageBuilder(curr: SelectDirectMessageWithUser, prevCreatedAt?: number | null, prevUserId?: number | null, pending?: boolean): ClientMessageType {
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
            type: "direct",
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
            user: authStore.user,
        };

        const originalMessages = [...messages.value];

        const res = await $fetch<SelectDirectMessage>(api.value, {
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
                if (response.status === 200) {
                    messages.value[0].pending = false;
                    if (socketStore.isConnected) {
                        socketStore.emit("send-direct-message", { ...response._data, user: authStore.user });
                    }
                }
            },
        });

        return res;
    };

    // initialize socket for DM chat
    async function init() {
        await socketStore.init();
        if (socketStore.isConnected && currentConversation.value) {
            resetState();
            socketStore.joinConversationRoom(currentConversation.value);
            socketStore.on("direct-message", (data: SelectDirectMessageWithUser) => {
                const clientMsg = ClientMessageBuilder(data, messages.value[0].createdAt, messages.value[0].user.id);
                messages.value.unshift(clientMsg);
            });

            socketStore.on("direct-message-editted", (data: SelectDirectMessage) => {
                reprocessMessagesAfterEdit(data);
            });

            socketStore.on("direct-message-deleted", (data: SelectDirectMessage) => {
                reprocessMessagesAfterDelete(data);
            });
        }
        await refreshMessages();
    }

    function leaveRoom() {
        if (currentConversation.value) {
            socketStore.leaveConversationRoom(currentConversation.value.id);
            resetState();
        }
        socketStore.off("message");
    }

    // set item for sidebar
    watchEffect(() => {
        if (conversations.value) {
            sidebarStore.sidebarConversationItems = conversations.value.map((item) => {
                return {
                    id: item.conversation.id,
                    to: { name: `channels-conversation-id`, params: { id: item.conversation.id } },
                    alt: item.conversation.name ?? item.otherUserDetails.name,
                    avatarUrl: item.otherUserDetails.image ?? undefined,
                    status: item.otherUserDetails.status === "Online" ? "Online" : "Offline",
                };
            });
        }

        sidebarStore.conversationLoading = conversationsStatus.value === "pending";
    });

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
        hasNext,
        editMessage,
        deleteMessage,
        cacheKey,
    };
});
