<script setup lang="ts">
const route = useRoute();
const error = route.query.error ?? "An unknown error occur";
</script>

<template>
    <div class="w-full h-full flex flex-col items-center gap-4">
        <h1 class="text-3xl font-bold mt-12">
            Oh no! {{ error }}
        </h1>
        <UButton
            icon="ic:baseline-arrow-back-ios-new"
            class="text-primary-foreground items-center font-semibold"
            @click="navigateTo({ path: '/' })"
        >
            Go back
        </UButton>
    </div>
</template>
