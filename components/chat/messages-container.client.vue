<script setup lang="ts">
import type { AsyncDataRequestStatus } from "#app";
import type { FetchError } from "ofetch";

import type { SelectDirectMessage, SelectMessage } from "~/lib/db/schema";
import type { ClientMessageType } from "~/lib/types";

const { hasNext, messages, messagesStatus } = defineProps<{
    messages: ClientMessageType[];
    messagesStatus: AsyncDataRequestStatus;
    hasNext: boolean;
}>();

const emits = defineEmits(["fetchNextMessages", "editMessage", "deleteMessage"]);

const { $csrfFetch } = useNuxtApp();
const toast = useToast();
const messageContainer = ref(null);
const firstMessageRef = ref(null);
const chosenMessage = ref<ClientMessageType | null>(null);
const shouldFetchNext = computed(() => messagesStatus !== "pending" && hasNext);
// Initialize auto-scroll

function handleFetchNext() {
    if (shouldFetchNext.value) {
        emits("fetchNextMessages");
    }
}

function handleEditMessage(data: SelectMessage | SelectDirectMessage) {
    emits("editMessage", data);
}

function onClose() {
    chosenMessage.value = null;
}

async function handleDeleteMessage() {
    if (chosenMessage.value) {
        try {
            if (chosenMessage.value.type === "channel") {
                const res = await $csrfFetch(`/api/messages/${chosenMessage.value.id}`, {
                    method: "DELETE",
                });
                emits("deleteMessage", res);
            }
            else {
                const res = await $csrfFetch(`/api/messages/direct/${chosenMessage.value.id}`, {
                    method: "DELETE",
                });
                emits("deleteMessage", res);
            }
        }
        catch (e) {
            const error = e as unknown as FetchError;
            toast.add({
                title: "An error occured while editing your message",
                description: getFetchErrorMessage(error),
                color: "error",
            });
        }
    }
}

function handleConfirmDeleteMessage(message: ClientMessageType) {
    chosenMessage.value = message;
}

useChatScroll(messageContainer, firstMessageRef, handleFetchNext);
</script>

<template>
    <div ref="messageContainer" class="w-full h-full flex flex-col-reverse grow overflow-y-scroll ">
        <!-- confirm remove msg dialog -->
        <LazyAppDialog
            :open="!!chosenMessage"
            confirm-color="error"
            confirm-label="Delete"
            title="Delete Message"
            description="Are you sure you want to delete this message?"
            @on-closed="onClose"
            @on-confirmed="handleDeleteMessage"
        >
            <template #body>
                <div v-if="chosenMessage" class="bg-background shadow-md rounded-md px-4 py-2 flex gap-4 items-start ">
                    <div class=" w-10 flex justify-end pt-1">
                        <UAvatar
                            size="xl"
                            :src="chosenMessage.user?.image ?? undefined"
                            :alt="chosenMessage.user?.name"
                        />
                    </div>
                    <div class="flex flex-col justify-between grow">
                        <div class="flex gap-2 items-baseline">
                            <span class="font-semibold">
                                {{ chosenMessage.user.name }}
                            </span>
                            <UTooltip
                                :content="{
                                    align: 'center',
                                    side: 'top',
                                }"
                                :text="formatFullDate(chosenMessage.createdAt)"
                            >
                                <span class="text-dimmed text-xs cursor-default">
                                    {{ formatMessageTime(chosenMessage.createdAt) }}
                                </span>
                            </UTooltip>
                        </div>
                        <!-- message content -->
                        <div class="flex items-end gap-1">
                            <pre class="text-base">{{ chosenMessage.content }}</pre>
                            <UTooltip
                                :content="{
                                    align: 'center',
                                    side: 'top',
                                }"
                                :text="formatFullDate(chosenMessage.updatedAt)"
                            >
                                <span v-if="chosenMessage.edited" class="text-dimmed text-xs cursor-default pb-1">
                                    (edited)
                                </span>
                            </UTooltip>
                        </div>
                    </div>
                </div>
            </template>
        </LazyAppDialog>
        <ChatMessage
            v-for="message in messages"
            :key="`msg-${message.createdAt}-${message.content}`"
            :message="message"
            @edit-message="handleEditMessage"
            @delete-message="handleConfirmDeleteMessage"
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
