<script setup lang="ts">
const { messages } = useChatMessages();
</script>

<template>
    <div v-for="message in messages" :key="`msg-${message.id}`">
        {{ message.content }}
    </div>
</template>
