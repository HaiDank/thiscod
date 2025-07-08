<script setup lang="ts">
const route = useRoute();

const { server } = route.params;

const serverStore = useServerStore();
onMounted(() => {
    serverStore.refreshCurrentServer();
});
</script>

<template>
    <div>
        server
        {{ server }}
    </div>
</template>
