<script setup lang="ts">
const authStore = useAuthStore();

onMounted(() => {
    if (authStore.user) {
        navigateTo("/channels");
    }
});
</script>

<template>
    <section class="w-screen h-screen flex items-center justify-center ">
        <img
            src="/wallpaper.jpg"
            class="h-full w-auto object-cover blur-[4px] brightness-75 -z-10 absolute"
        >
        <slot />
    </section>
</template>
