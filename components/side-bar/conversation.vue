<script setup lang="ts">
const conversationStore = useConversationStore();
await conversationStore.refreshConversations();
console.log(conversationStore.conversations);
</script>

<template>
    <div class="grow border-t border-l rounded-tl-lg ">
        <div class="h-12 w-full border-b font-semibold flex items-center justify-between px-4">
            <UButton
                variant="soft"
                color="neutral"
                class="w-full flex justify-center font-semibold cursor-pointer"
            >
                Find or start a conversation
            </UButton>
        </div>
    </div>
</template>
