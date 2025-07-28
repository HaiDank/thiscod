<script setup lang="ts">
import * as z from "zod";

const route = useRoute();
const serverStore = useServerStore();
const chatStore = useChatStore();
const { currentServer, currentChannel } = storeToRefs(serverStore);

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
        <section v-if="currentChannel" class="w-full h-full bg-background flex flex-col gap-2">
            <ChatHeader :channel-name="currentChannel.name" :type="currentChannel.channelType" />
            <div class="w-full h-full flex flex-col grow overflow-hidden">
                <div class="flex w-full h-1/2 flex-col items-center justify-center text-3xl font-semibold">
                    <h4>
                        Welcome to
                    </h4>
                    <h4>
                        {{ currentServer?.name }}
                    </h4>
                </div>
                <ChatMessage />
            </div>
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
