<script setup lang="ts">
import type { ChatInput } from "#components";

import * as z from "zod";

import type { InsertMessage, SelectDirectMessage, SelectMessage } from "~/lib/db/schema";

const inputRef = ref<InstanceType<typeof ChatInput> | null>(null);

const route = useRoute();
const serverStore = useServerStore();
const chatStore = useChatStore();
const { currentChannel } = storeToRefs(serverStore);
const { csrf } = useCsrf();
const { fetchNextMessages, sendMessage } = chatStore;
const { messages, messagesStatus, hasNext } = storeToRefs(chatStore);
if (!z.coerce.number().safeParse(route.params.channel).success) {
    await navigateTo({ name: "channels-server", params: {
        server: route.params.server,
    } });
}

await serverStore.refreshCurrentChannel();
onMounted(() => {
    chatStore.init();
});

onBeforeUnmount(() => {
    chatStore.leaveRoom();
});

async function handleSendMessage(data: InsertMessage) {
    await sendMessage(data, Number(route.params.channel), Number(route.params.server), csrf);
    inputRef.value?.resetForm();
}

function handleEditMessage(data: SelectMessage | SelectDirectMessage) {
    if ("channelId" in data) {
        chatStore.editMessage(data);
    }
}

function handleDeleteMessage(data: SelectMessage | SelectDirectMessage) {
    if ("channelId" in data) {
        chatStore.deleteMessage(data);
    }
}
</script>

<template>
    <div class="w-full h-full ">
        <section v-if="currentChannel" class="w-full h-full bg-background flex flex-col gap-2 grow-0">
            <ChatHeader :title="currentChannel.name">
                <template #leading>
                    <UIcon :name="currentChannel.channelType === 'TEXT' ? 'ic:round-numbers' : 'material-symbols:volume-up'" />
                </template>
            </ChatHeader>

            <ChatMessagesContainer
                :messages="messages"
                :messages-status="messagesStatus"
                :has-next="hasNext"
                @fetch-next-messages="fetchNextMessages"
                @edit-message="handleEditMessage"
                @delete-message="handleDeleteMessage"
            >
                <template #start>
                    <div class="w-full px-4">
                        <UAvatar
                            :ui="{
                                icon: 'text-default size-12',
                            }"
                            class="size-16 text-default"
                            :icon="getChannelIcon(currentChannel.channelType)"
                        />
                        <h1 class="text-4xl font-bold flex items-end gap-1">
                            Welcome to <span class="flex items-end"><UIcon :name="getChannelIcon(currentChannel.channelType)" /> {{ currentChannel.name }}!</span>
                        </h1>
                        <p class="flex items-end gap-1">
                            This is the start of <span class="flex items-end"> <UIcon :name="getChannelIcon(currentChannel.channelType)" /> {{ currentChannel.name }} channel</span>
                        </p>
                    </div>
                </template>
            </ChatMessagesContainer>
            <ChatInput
                ref="inputRef"
                :placeholder="currentChannel.name"
                @send-message="handleSendMessage"
            />
        </section>
        <div v-else>
            Chat not found
        </div>
    </div>
</template>
