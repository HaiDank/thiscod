<script setup lang="ts">
import { cn } from "~/lib/utils";

const serverStore = useServerStore();
const socket = useSocketStore();
const authStore = useAuthStore();
await authStore.init();
await serverStore.refreshServers();

const {
    serversStatus,
} = storeToRefs(serverStore);

onMounted(async () => {
    await socket.init();
});

onUnmounted(() => {
    socket.disconnect();
});

const isResizing = useIsResizing();
</script>

<template>
    <section :class="cn('w-screen h-screen overflow-hidden', isResizing && 'cursor-ew-resize ')">
        <div v-if="serversStatus !== 'success'" class="w-screen h-screen bg-background absolute top-0 left-0 z-100 flex items-center justify-center">
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
