<script setup lang="ts">
import type { SelectServerWithChannels } from "~/lib/db/schema";

import { cn } from "~/lib/utils";

defineProps<{
    server: SelectServerWithChannels | null;
}>();
const chatStore = useChatStore();
// const { fetchNextMessages, refreshMessages } = chatStore;
const { messages } = storeToRefs(chatStore);
const messageContainer = ref(null);
// Initialize auto-scroll
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
            class="hover:bg-highlight group px-4 py-0.5 flex gap-4 items-center"
        >
            <div class=" w-10 flex justify-end">
                <span v-if="message.isConnected" class="group-hover:flex hidden text-dimmed text-[0.75rem]">
                    {{ formatSimpleMessageTime(message.createdAt) }}
                </span>
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
                    <span class="text-dimmed text-xs">
                        {{ formatMessageTime(message.createdAt) }}
                    </span>
                </div>
                <p :class="cn('text-base', message.pending ? 'text-dimmed' : '')">
                    {{ message.content }}
                </p>
            </div>
        </div>
        <div class="flex w-full h-1/4 flex-col items-center justify-center text-3xl font-semibold">
            <h4>
                Welcome to
            </h4>
            <h4>
                {{ server?.name }}
            </h4>
        </div>
    </div>
</template>
