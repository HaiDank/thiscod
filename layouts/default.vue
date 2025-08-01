<script setup lang="ts">
import { cn } from "~/lib/utils";

const serverStore = useServerStore();
const socket = useSocketStore();
const authStore = useAuthStore();
await authStore.init();
await serverStore.refreshServers();
await socket.init();

const {
    serversStatus,

} = storeToRefs(serverStore);

onUnmounted(() => {
    socket.disconnect();
});

const isResizing = useIsResizing();
</script>

<template>
    <section :class="cn('w-screen h-screen overflow-hidden', isResizing && 'cursor-ew-resize ')">
        <div :class="cn('w-screen h-screen bg-background absolute top-0 left-0 z-100 flex items-center justify-center', serversStatus === 'pending' ? '' : 'hidden')">
            <UIcon name="mdi:jellyfish" class="animate-spin-ease-loop size-32" />
        </div>
        <Header />
        <div class="w-full h-[calc(100vh-2rem)] flex relative">
            <SideBar />
            <div class="w-full h-full flex border-background bg-background">
                <slot />
            </div>
        </div>
    </section>
</template>
