<script setup lang="ts">
defineProps<{
    open: boolean;
    confirmLabel: string;
    confirmColor: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral";
    title: string;
    bodyStyle?: string;
    description: string;
}>();

const emit = defineEmits(["onClosed", "onConfirmed", "afterLeave"]);

function onClose() {
    emit("onClosed");
}

function onConfirm() {
    emit("onConfirmed");
}
</script>

<template>
    <UModal
        :open="open"
        :title="title"
        :description="description"
        :ui="{ footer: 'justify-end', body: bodyStyle }"
        :close="false"
        :dismissible="false"
        @after:leave="emit('afterLeave')"
        @close:prevent="onClose"
    >
        <template #body>
            <slot name="body" />
        </template>
        <template #footer>
            <UButton
                class="font-semibold"
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="onClose"
            />
            <UButton
                class="font-semibold text-default"
                :label="confirmLabel"
                :color="confirmColor"
                @click="onConfirm"
            />
        </template>
    </UModal>
</template>
