<script setup lang="ts">
const route = useRoute();

const { server } = route.params;
</script>

<template>
    <div>
        server
        {{ server }}
    </div>
</template>
