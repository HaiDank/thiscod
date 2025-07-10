<script setup lang="ts">
const serverStore = useServerStore();
const sidebarStore = useSidebarStore();
const route = useRoute();
const {
    currentServer,
} = storeToRefs(serverStore);
const {
    chosenChannels,
} = storeToRefs(sidebarStore);

onMounted(async () => {
    await serverStore.refreshCurrentServer();

    if (route.name?.toString() === "channels-server" && currentServer.value && currentServer.value.channels.length > 0) {
        if (chosenChannels.value.has(`${currentServer.value!.id}`)) {
            await navigateTo(chosenChannels.value.get(`${currentServer.value!.id}`)?.to);
        }
        else {
            await navigateTo({ name: "channels-server-channel", params: { channel: currentServer.value!.channels[0].id, server: currentServer.value.id } });
        }
    }
});
</script>

<template>
    <div class="w-full h-full ">
        <NuxtPage />
    </div>
</template>
