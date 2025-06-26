<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
    get() {
        return colorMode.value === "dark";
    },
    set(value) {
        colorMode.preference = value ? "dark" : "light";
    },
});
</script>

<template>
    <USwitch
        v-model="isDark"
        unchecked-icon="tabler:sun"
        checked-icon="tabler:moon-filled"
    />
</template>
