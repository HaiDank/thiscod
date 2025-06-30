<script setup lang="ts">

</script>

<template>
    <UModal
        title="Modal with title"
        :ui="{
            title: 'text-center',
            description: 'text-muted text-center',
        }"
    >
        <UButton
            label="Open"
            color="neutral"
            variant="subtle"
        />

        <template #body>
            <Placeholder class="h-48" />
        </template>
    </UModal>
</template>
