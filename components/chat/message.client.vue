<script setup lang="ts">
const { messages } = useChatStore();
</script>

<template>
    <div v-for="message in messages" :key="`msg-${message.id}`">
        {{ message.content }}
    </div>
</template>
