<script setup lang="ts">
definePageMeta({
    layout: false,
});

const serverStore = useServerStore();

const {
    serversStatus,
} = storeToRefs(serverStore);

onMounted(() => {
    serverStore.refreshServers();
});

watchEffect(async () => {
    if (serversStatus.value === "success") {
        await navigateTo("/channels");
    }
});
</script>

<template>
    <div class="w-screen h-screen bg-background absolute top-0 left-0 z-100 flex items-center justify-center">
        <UIcon name="mdi:jellyfish" class="animate-spin-ease-loop size-32" />
    </div>
</template>
