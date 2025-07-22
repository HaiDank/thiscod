<script setup lang="ts">
import * as z from "zod";

const route = useRoute();

const channel = ref<SidebarChannelItem | null>(null);

if (!z.coerce.number().safeParse(route.params.channel).success) {
    await navigateTo({ name: "channels-server", params: {
        server: route.params.server,
    } });
}
</script>

<template>
    <div class="w-full h-full ">
        <section v-if="channel" class="w-full h-full bg-background flex flex-col gap-2">
            <ChatHeader :channel-name="channel.name" :icon="channel.icon" />
            <div class="w-full h-full flex flex-col grow overflow-hidden">
                <div class="flex w-full h-1/2 flex-col items-center justify-center text-3xl font-semibold">
                    <h4>
                        Welcome to
                    </h4>
                    <h4>
                        the server
                    </h4>
                </div>
                <ChatMessage />
            </div>
            <ChatInput :placeholder="channel.name" />
        </section>
        <div v-else>
            Chat not found
        </div>
    </div>
</template>
