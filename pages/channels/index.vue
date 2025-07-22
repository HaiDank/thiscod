<script setup lang="ts">
const socket = useSocketStore();

onMounted(async () => {
    await socket.init();
});
onUnmounted(() => {
    socket.disconnect();
});
</script>

<template>
    <div class="w-full h-full">
        <NuxtPage />
    </div>
</template>
