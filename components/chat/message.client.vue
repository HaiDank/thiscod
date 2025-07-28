<script setup lang="ts">
const { messages } = useChatStore();

console.log(messages);
</script>

<template>
    <div
        v-for="message in messages"
        :key="`msg-${message.id}`"
        class="hover:hover:bg-highlight px-4 py-1 flex gap-4 items-center"
    >
        <UAvatar :src="message.user?.image ?? undefined" :alt="message.user?.name" />
        <div class="flex flex-col justify-between">
            <div class="flex gap-2 items-center">
                <span class="font-semibold">
                    {{ message.user.name }}
                </span>
                <span class="text-dimmed text-xs">
                    {{ formatMessageTime(message.createdAt) }}
                </span>
            </div>
            <p>
                {{ message.content }}
            </p>
        </div>
    </div>
</template>
