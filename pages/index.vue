<script setup lang="ts">
const route = useRoute();
if (route.path === "/channels") {
    navigateTo("/channels/me");
}
</script>

<template>
    <div>
        Rerouting...
    </div>
</template>
