<script setup>
const isConnected = ref(false);
const messages = ref([]);
const newMessage = ref("");
const socket = useSocket();
socket.connect();

if (socket.connected) {
    onConnect();
}

function onConnect() {
    isConnected.value = true;
}

function onDisconnect() {
    isConnected.value = false;
}

function onMessage(data) {
    messages.value.push(data);
}

function sendMessage() {
    if (newMessage.value.trim()) {
        socket.emit("message", {
            id: Date.now(),
            text: newMessage.value,
            timestamp: new Date().toLocaleTimeString(),
        });
        newMessage.value = "";
    }
}

onMounted(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
});

onBeforeUnmount(() => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("message", onMessage);
});
onUnmounted(() => {
    socket.disconnect();
});
</script>

<template>
    <div class="socket-container">
        <div class="chat-card">
            <h3>Real-time Chat</h3>
            <div class="messages">
                <div
                    v-for="msg in messages"
                    :key="msg.id"
                    class="message"
                >
                    <span class="timestamp">{{ msg.timestamp }}</span>
                    <span class="text">{{ msg.text }}</span>
                </div>
            </div>

            <div class="input-area">
                <input
                    v-model="newMessage"
                    :disabled="!isConnected"
                    placeholder="Type a message..."
                    @keyup.enter="sendMessage"
                >
                <button :disabled="!isConnected || !newMessage.trim()" @click="sendMessage">
                    Send
                </button>
            </div>
        </div>
    </div>
</template>
