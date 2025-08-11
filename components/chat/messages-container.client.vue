<script setup lang="ts">
import type { AsyncDataRequestStatus } from "#app";

import type { ClientMessageType } from "~/lib/types";

const { hasNext, messages, messagesStatus } = defineProps<{
    messages: ClientMessageType[];
    messagesStatus: AsyncDataRequestStatus;
    hasNext: boolean;
}>();

const emits = defineEmits(["fetchNextMessages"]);

const messageContainer = ref(null);
const firstMessageRef = ref(null);
const shouldFetchNext = computed(() => messagesStatus !== "pending" && hasNext);
// Initialize auto-scroll

function handleFetchNext() {
    if (shouldFetchNext.value) {
        emits("fetchNextMessages");
    }
}

// function handleEditMessage(data) {

// }

useChatScroll(messageContainer, firstMessageRef, handleFetchNext);
</script>

<template>
    <div ref="messageContainer" class="w-full h-full flex flex-col-reverse grow overflow-y-scroll ">
        <ChatMessage
            v-for="message in messages"
            :key="`msg-${message.createdAt}-${message.content}`"
            :message="message"
            @edit-message="handleEditMessage"
        />
        <div
            ref="firstMessageRef"
            class="w-full"
        />
        <div
            v-if="messagesStatus === 'pending'"
            class="w-full"
        >
            <ChatSkeleton
                v-for="msg in 10"
                :key="msg"
            />
        </div>

        <slot v-else name="start" />
    </div>
</template>
