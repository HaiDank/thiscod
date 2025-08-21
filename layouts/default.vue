<script setup lang="ts">
import { cn } from "~/lib/utils";

const serverStore = useServerStore();
const socket = useSocketStore();
const authStore = useAuthStore();
const conversationStore = useConversationStore();
await authStore.init();
await serverStore.refreshServers();
await conversationStore.refreshConversations();

const {
    serversStatus,
} = storeToRefs(serverStore);
const {
    conversationsStatus,
} = storeToRefs(conversationStore);

const isLoading = computed(() => conversationsStatus.value === "pending" || serversStatus.value === "pending");

onMounted(() => {
    socket.init();
});

onBeforeUnmount(() => {
    socket.disconnect();
});

const isResizing = useIsResizing();
</script>

<template>
    <section :class="cn('w-screen h-screen overflow-hidden', isResizing && 'cursor-ew-resize ')">
        <AppUserProfile />
        <div :class="cn('w-screen h-screen bg-background absolute top-0 left-0 z-100 flex items-center justify-center', isLoading ? '' : 'hidden')">
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
