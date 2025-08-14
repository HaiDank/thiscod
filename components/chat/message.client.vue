<script setup lang="ts">
import type { AppUserDetailPopover } from "#components";
import type { FetchError } from "ofetch";

import type { InsertMessage } from "~/lib/db/schema";
import type { ClientMessageType } from "~/lib/types";

import { cn } from "~/lib/utils";

const { message } = defineProps<{
    message: ClientMessageType;
}>();

const emit = defineEmits(["editMessage", "deleteMessage"]);
const authStore = useAuthStore();
const toast = useToast();
const { $csrfFetch } = useNuxtApp();
const isEditMode = ref(false);
const isSender = computed(() => `${authStore.user?.id}` === `${message.user.id}`);
const popoverRef = ref<InstanceType<typeof AppUserDetailPopover> | null>(null);

function togglePopover() {
    if (popoverRef.value) {
        popoverRef.value.togglePopover();
    }
}
async function handleEditMessage(data: InsertMessage) {
    isEditMode.value = false;
    try {
        if (message.type === "channel") {
            const res = await $csrfFetch(`/api/messages/${message.id}`, {
                method: "PATCH",
                body: data,
            });
            emit("editMessage", res);
        }
        else {
            const res = await $csrfFetch(`/api/messages/direct/${message.id}`, {
                method: "PATCH",
                body: data,
            });
            emit("editMessage", res);
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

function handleDeleteMessage() {
    emit("deleteMessage", message);
}
</script>

<template>
    <div
        :class="cn('hover:bg-highlight group px-4 py-0.5 flex gap-4 items-start relative', !message.isConnected && 'mt-4', isEditMode && 'bg-highlight')"
    >
        <!-- action bar -->

        <div v-if="isSender && !isEditMode" class="absolute hidden group-hover:flex items-center justify-center -top-4 right-4 p-0.5 bg-card border border-border/50 rounded-md">
            <UTooltip
                text="Edit"
                :delay-duration="0"
                arrow
                :content="{
                    side: 'top',
                    align: 'center',
                }"
            >
                <UButton
                    variant="link"
                    color="neutral"
                    class="hover:scale-110 hover:bg-highlight transition-transform cursor-pointer"
                    size="sm"
                    icon="material-symbols:edit-rounded"
                    aria-label="Edit"
                    @click="isEditMode = true"
                />
            </UTooltip>
            <UTooltip
                text="Remove"
                :delay-duration="0"
                arrow
                :content="{
                    side: 'top',
                    align: 'center',
                }"
            >
                <UButton
                    variant="link"
                    color="error"
                    class="hover:scale-110 hover:bg-highlight transition-transform cursor-pointer"
                    size="sm"
                    icon="material-symbols:delete-rounded"
                    aria-label="remove"
                    @click="handleDeleteMessage"
                />
            </UTooltip>
        </div>

        <!-- avatar or timestamp -->
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
            <AppUserDetailPopover
                v-else
                ref="popoverRef"
                :user="message.user"
            >
                <template #anchor>
                    <UAvatar
                        class="cursor-pointer"
                        size="xl"
                        :src="message.user?.image ?? undefined"
                        :alt="message.user?.name"
                        @click="togglePopover"
                    />
                </template>
            </AppUserDetailPopover>
        </div>
        <div class="flex flex-col justify-between grow">
            <!-- user name and timestamp -->
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
            <!-- message content -->
            <div v-if="!isEditMode" class="flex items-end gap-1">
                <pre :class="cn('text-base ', message.pending ? 'text-dimmed' : '')">{{ message.content }}</pre>
                <UTooltip
                    :content="{
                        align: 'center',
                        side: 'top',
                    }"
                    :text="formatFullDate(message.updatedAt)"
                >
                    <span v-if="message.edited" class="text-dimmed text-xs cursor-default pb-1">
                        (edited)
                    </span>
                </UTooltip>
            </div>

            <!-- edit message -->
            <LazyChatEditMessage
                v-else
                :message="message"
                @cancel="isEditMode = false"
                @edit-message="handleEditMessage"
            />
        </div>
    </div>
</template>
