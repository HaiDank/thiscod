<script setup lang="ts">
import type { SelectChannelWithMessages } from "~/lib/db/schema";

import { cn } from "~/lib/utils";
import { getChannelIcon } from "~/utils/utils";

defineProps<{
    channel: SelectChannelWithMessages;
}>();
const chatStore = useChatStore();
const { fetchNextMessages } = chatStore;
const { messages, messagesStatus, hasNext } = storeToRefs(chatStore);
const messageContainer = ref(null);
const firstMessageRef = ref(null);
const shouldFetchNext = computed(() => messagesStatus.value !== "pending" && hasNext.value);
// Initialize auto-scroll

function handleFetchNext() {
    if (shouldFetchNext.value) {
        fetchNextMessages();
    }
}

useChatScroll(messageContainer, firstMessageRef, handleFetchNext);
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
        <div v-else class="w-full px-4">
            <UAvatar
                :ui="{
                    icon: 'text-default size-12',
                }"
                class="size-16 text-default"
                :icon="getChannelIcon(channel.channelType)"
            />
            <h1 class="text-4xl font-bold flex items-end gap-1">
                Welcome to <span class="flex items-end"><UIcon :name="getChannelIcon(channel.channelType)" /> {{ channel.name }}!</span>
            </h1>
            <p class="flex items-end gap-1">
                This is the start of <span class="flex items-end"> <UIcon :name="getChannelIcon(channel.channelType)" /> {{ channel.name }} channel</span>
            </p>
        </div>
    </div>
</template>
