<script setup lang="ts">
defineProps<{
    open: boolean;
    confirmLabel: string;
    confirmColor: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral";
    title: string;
    description: string;
}>();

const emit = defineEmits(["onClosed", "onConfirmed"]);

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
        :ui="{ footer: 'justify-end' }"
        :close="false"
        :dismissible="false"
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
