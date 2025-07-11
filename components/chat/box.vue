<script setup lang="ts">
defineProps<{
    item?: SidebarChannelItem;
}>();
const socket = useSocket();
socket.connect();
</script>

<template>
    <section class="w-full h-full bg-background flex flex-col gap-2">
        <ChatHeader :channel-name="item?.name" :icon="item?.icon" />
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
        <ChatInput :placeholder="item?.name" />
    </section>
</template>
