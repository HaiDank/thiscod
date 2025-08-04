<script setup lang="ts">
const receivedRequests = ref<ClientUser[]>([]);
</script>

<template>
    <div class="flex flex-col gap-2 w-full h-full">
        <span v-if="receivedRequests.length > 0" class>
            Received - {{ receivedRequests.length }}
        </span>
    </div>
</template>

<style scoped>

</style>
