<script setup lang="ts">
import type { ChatInput } from "#components";

import * as z from "zod";

import type { InsertDirectMessage } from "~/lib/db/schema";

const route = useRoute();
const { csrf } = useCsrf();
const conversationStore = useConversationStore();
const { fetchNextMessages, sendMessage, refreshCurrentConversation } = conversationStore;
const { currentConversation, hasNext, messages, messagesStatus, currentConversationStatus } = storeToRefs(conversationStore);

const inputRef = ref<InstanceType<typeof ChatInput> | null>(null);

if (!z.coerce.number().safeParse(route.params.id).success) {
    await navigateTo({ name: "channels-me-friends" });
}
onMounted(async () => {
    await refreshCurrentConversation();
    await conversationStore.init();
});

onBeforeUnmount(() => {
    conversationStore.leaveRoom();
});

async function handleSendMessage(data: InsertDirectMessage) {
    await sendMessage(data, Number(route.params.id), csrf);
    inputRef.value?.resetForm();
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

            <ChatMessage
                :fetch-next-messages="fetchNextMessages"
                :has-next="hasNext"
                :messages="messages"
                :messages-status="messagesStatus"
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
            </ChatMessage>
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
