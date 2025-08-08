<script setup lang="ts">
onMounted(async () => {
    await navigateTo({ name: "channels-me-friends" });
});
</script>

<template>
    <div class="w-full h-full">
        <NuxtPage />
    </div>
</template>
