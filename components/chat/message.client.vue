<script setup lang="ts">
import type { AsyncDataRequestStatus } from "#app";

import type { ClientMessageType } from "~/lib/types";

import { cn } from "~/lib/utils";

const { fetchNextMessages, hasNext, messages, messagesStatus } = defineProps<{
    fetchNextMessages: () => Promise<void>;
    messages: ClientMessageType[];
    messagesStatus: AsyncDataRequestStatus;
    hasNext: boolean;
}>();

const messageContainer = ref(null);
const firstMessageRef = ref(null);
const shouldFetchNext = computed(() => messagesStatus !== "pending" && hasNext);
// Initialize auto-scroll

function handleFetchNext() {
    if (shouldFetchNext.value) {
        fetchNextMessages();
    }
}

watchEffect(() => {
    console.log(messages);
});

useChatScroll(messageContainer, firstMessageRef, handleFetchNext);
</script>

<template>
    <div ref="messageContainer" class="w-full h-full flex flex-col-reverse grow overflow-y-scroll ">
        <div
            v-for="message in messages"
            :key="`msg-${message.createdAt}-${message.content}`"
            :class="cn('hover:bg-highlight group px-4 py-0.5 flex gap-4 items-start', !message.isConnected && 'mt-4')"
        >
            <div class=" w-10 flex justify-end pt-1">
                <UTooltip
                    v-if="message.isConnected"
                    :content="{
                        align: 'center',
                        side: 'top',
                    }"
                    :text="formatFullDate(message.createdAt)"
                >
                    <span class="group-hover:flex hidden text-dimmed text-[0.75rem] cursor-default">
                        {{ formatSimpleMessageTime(message.createdAt) }}
                    </span>
                </UTooltip>
                <UAvatar
                    v-else
                    size="xl"
                    :src="message.user?.image ?? undefined"
                    :alt="message.user?.name"
                />
            </div>
            <div class="flex flex-col justify-between">
                <div v-if="!message.isConnected" class="flex gap-2 items-baseline">
                    <span class="font-semibold">
                        {{ message.user.name }}
                    </span>
                    <UTooltip
                        :content="{
                            align: 'center',
                            side: 'top',
                        }"
                        :text="formatFullDate(message.createdAt)"
                    >
                        <span class="text-dimmed text-xs cursor-default">
                            {{ formatMessageTime(message.createdAt) }}
                        </span>
                    </UTooltip>
                </div>
                <pre :class="cn('text-base ', message.pending ? 'text-dimmed' : '')">{{ message.content }}</pre>
            </div>
        </div>
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
