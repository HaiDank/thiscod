<script setup lang="ts">
defineProps<{
    item?: SidebarChannelItem;
}>();
const isConnected = ref(false);
const messages = ref([]);
// const newMessage = ref("");

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

// function sendMessage() {
//     if (newMessage.value.trim()) {
//         socket.emit("message", {
//             id: Date.now(),
//             text: newMessage.value,
//             timestamp: new Date().toLocaleTimeString(),
//         });
//         newMessage.value = "";
//     }
// }

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
    <section class="w-full h-full bg-background flex flex-col gap-2">
        <ChatHeader :channel-name="item?.name" :icon="item?.icon" />
        <div class="w-full h-full flex flex-col grow overflow-hidden">
            <div class="flex w-full h-1/2 flex-col items-center justify-center text-3xl font-semibold">
                <h4>
                    Welcome to
                </h4>
                <h4>
                    the server
                </h4>
            </div>
            <ChatMessage />
        </div>
        <ChatInput />
    </section>
</template>
