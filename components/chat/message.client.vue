<script setup lang="ts">
import type { SelectServerWithChannels } from "~/lib/db/schema";

import { cn } from "~/lib/utils";

defineProps<{
    server: SelectServerWithChannels | null;
}>();
const chatStore = useChatStore();
const { fetchNextMessages } = chatStore;
const { messages, messagesStatus } = storeToRefs(chatStore);
const messageContainer = ref(null);
const firstMessageRef = ref(null);
// Initialize auto-scroll

useChatScroll(messageContainer, firstMessageRef, fetchNextMessages, messagesStatus.value !== "pending");
</script>

<template>
    <div ref="messageContainer" class="w-full h-full flex flex-col-reverse grow overflow-y-scroll ">
        <!-- <UButton @click="fetchNextMessages">
            Fetch next
        </UButton>
        <UButton @click="() => refreshMessages()">
            reFetch
        </UButton> -->
        <div
            v-for="message in messages"
            :key="`msg-${message.createdAt}-${message.content}`"
            :class="cn('hover:bg-highlight group px-4 py-0.5 flex gap-4 items-center', !message.isConnected && 'mt-4')"
        >
            <div class=" w-10 flex justify-end">
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
                <p :class="cn('text-base', message.pending ? 'text-dimmed' : '')">
                    {{ message.content }}
                </p>
            </div>
        </div>
        <div
            ref="firstMessageRef"
            class="h-10 w-full"
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
    </div>
</template>
