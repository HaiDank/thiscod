<script setup lang="ts">
import type { ChatInput } from "#components";

import * as z from "zod";

import type { InsertDirectMessage, SelectDirectMessage, SelectMessage } from "~/lib/db/schema";

const route = useRoute();
const { csrf } = useCsrf();
const inputRef = ref<InstanceType<typeof ChatInput> | null>(null);

if (!z.coerce.number().safeParse(route.params.id).success) {
    await navigateTo({ name: "channels-me-friends" });
}

const conversationStore = useConversationStore();

onMounted(async () => {
    await conversationStore.refreshCurrentConversation();
    conversationStore.init();
});

onBeforeUnmount(() => {
    conversationStore.leaveRoom();
});

const { fetchNextMessages, sendMessage } = conversationStore;
const { currentConversation, hasNext, messages, messagesStatus, currentConversationStatus } = storeToRefs(conversationStore);

async function handleSendMessage(data: InsertDirectMessage) {
    const copy = { ...data };
    inputRef.value?.resetForm();
    await sendMessage(copy, Number(route.params.id), csrf);
}

function handleEditMessage(data: SelectMessage | SelectDirectMessage) {
    if ("conversationId" in data) {
        conversationStore.editMessage(data);
    }
}

function handleDeleteMessage(data: SelectMessage | SelectDirectMessage) {
    if ("conversationId" in data) {
        conversationStore.deleteMessage(data);
    }
}
</script>

<template>
    <div class="w-full h-full ">
        <section v-if="currentConversation" class="w-full h-full bg-background flex flex-col gap-2 grow-0">
            <ChatHeader :title="currentConversation.otherUser.name">
                <template #leading>
                    <UserAvatar
                        :name="currentConversation.otherUser.name"
                        :avatar="currentConversation.otherUser.image ?? undefined"
                        :status="currentConversation.otherUser.status === 'Online' ? 'Online' : 'Offline'"
                        size="xs"
                    />
                </template>
            </ChatHeader>

            <ChatMessagesContainer
                :has-next="hasNext"
                :messages="messages"
                :messages-status="messagesStatus"
                @fetch-next-messages="fetchNextMessages"
                @edit-message="handleEditMessage"
                @delete-message="handleDeleteMessage"
            >
                <template #start>
                    <div class="w-full px-4 space-y-2">
                        <UAvatar
                            :alt="currentConversation.otherUser.name"
                            :avatar="currentConversation.otherUser.image"
                            :ui="{
                                root: 'size-16 text-default text-3xl',
                            }"
                        />
                        <h1 class="text-3xl font-bold flex items-end gap-1">
                            {{ currentConversation.otherUser.name }}
                        </h1>
                        <p class="flex items-end gap-1">
                            This is the beginning of you direct message history with  <span class="flex items-end">  {{ currentConversation.otherUser.name }}</span>
                        </p>
                    </div>
                </template>
            </ChatMessagesContainer>
            <ChatInput
                ref="inputRef"
                :placeholder="`Message @${currentConversation.otherUser.name}`"
                @send-message="handleSendMessage"
            />
        </section>
        <div
            v-else-if="currentConversationStatus === 'pending'"
            class="w-full h-full flex flex-col justify-between"
        >
            <USkeleton
                class="w-full  box-border shrink-0 h-[calc((var(--spacing)*12)+1px)] px-4 border-t border-b"
            />
            <div class="w-full px-4 pb-4">
                <USkeleton
                    class="w-full  shrink-0 h-16 px-4 border-t border-b"
                />
            </div>
        </div>
        <div v-else>
            Conversation not found
        </div>
    </div>
</template>
