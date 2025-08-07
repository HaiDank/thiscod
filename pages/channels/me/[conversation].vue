<script setup lang="ts">
import * as z from "zod";

import type { InsertDirectMessage } from "~/lib/db/schema";

const route = useRoute();
const { csrf } = useCsrf();
const conversationStore = useConversationStore();
const { fetchNextMessages, sendMessage } = conversationStore;
const { currentConversation, hasNext, messages, messagesStatus } = storeToRefs(conversationStore);

if (!z.coerce.number().safeParse(route.params.id).success) {
    await navigateTo({ name: "channels-me" });
}

onMounted(() => {
    conversationStore.init();
});

onBeforeUnmount(() => {
    conversationStore.leaveRoom();
});

async function handleSendMessage(data: InsertDirectMessage) {
    const res = await sendMessage(data, Number(route.params.conversation), csrf);
    console.log(res);
}
</script>

<template>
    <div class="w-full h-full ">
        <section v-if="currentConversation" class="w-full h-full bg-background flex flex-col gap-2 grow-0">
            <ChatHeader :title="currentConversation.UserOne.name">
                <template #leading />
            </ChatHeader>

            <ChatMessage
                :fetch-next-messages="fetchNextMessages"
                :has-next="hasNext"
                :messages="messages"
                :messages-status="messagesStatus"
            >
                <template #start>
                    <div class="w-full px-4">
                        <UAvatar
                            :ui="{
                                icon: 'text-default size-12',
                            }"
                            class="size-16 text-default"
                        />
                        <h1 class="text-4xl font-bold flex items-end gap-1">
                            Welcome to <span class="flex items-end">{{ currentConversation.name }}!</span>
                        </h1>
                        <p class="flex items-end gap-1">
                            This is the start of <span class="flex items-end">  {{ currentConversation.name }} channel</span>
                        </p>
                    </div>
                </template>
            </ChatMessage>
            <ChatInput
                :placeholder="`Message @${currentConversation.UserOne.name}`"
                @send-message="handleSendMessage"
            />
        </section>
        <div v-else>
            Conversation not found
        </div>
    </div>
</template>
