<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
    <button
        variant="outline"
        class="relative"
        @click="colorMode.preference === 'light' ? colorMode.preference = 'dark' : colorMode.preference = 'light'"
    >
        <Icon
            name="ic:baseline-light-mode"
            class="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Icon
            name="ic:outline-mode-night"
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
    </button>
</template>
