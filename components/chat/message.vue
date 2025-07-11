<script setup lang="ts">
import type { SelectMessage } from "~/lib/db/schema";

const socket = useSocket();
const messages = ref<SelectMessage[]>([]);

function onMessage(data: SelectMessage) {
    messages.value.push(data);
}

onMounted(() => {
    socket.on("message", onMessage);
});

onBeforeUnmount(() => {
    socket.off("message", onMessage);
});
onUnmounted(() => {
    socket.disconnect();
});
</script>

<template>
    <div v-for="message in messages" :key="`msg-${message.id}`">
        {{ message.content }}
    </div>
</template>
