<script setup lang="ts">
import * as z from "zod";

const route = useRoute();
const serverStore = useServerStore();
const chatStore = useChatStore();
const { currentChannel } = storeToRefs(serverStore);

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
</script>

<template>
    <div class="w-full h-full ">
        <section v-if="currentChannel" class="w-full h-full bg-background flex flex-col gap-2 grow-0">
            <ChatHeader :channel-name="currentChannel.name" :type="currentChannel.channelType" />

            <ChatMessage :channel="currentChannel" />
            <ChatInput
                :server-id="Number(route.params.server)"
                :channel-id="Number(route.params.channel)"
                :placeholder="currentChannel.name"
            />
        </section>
        <div v-else>
            Chat not found
        </div>
    </div>
</template>
