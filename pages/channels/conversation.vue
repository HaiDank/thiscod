<script setup lang="ts">
import z from "zod";

const route = useRoute();
if (!z.coerce.number().safeParse(route.params.id).success) {
    await navigateTo({ name: "channels-me-friends" });
}
</script>

<template>
    <div class="w-full h-full ">
        <NuxtPage />
    </div>
</template>
