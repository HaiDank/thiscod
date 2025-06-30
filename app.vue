<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
    <UApp>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </UApp>
</template>
