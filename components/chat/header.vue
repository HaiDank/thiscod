<script setup lang="ts">
defineProps<{
    channelName?: string;
    icon?: string;
}>();
</script>

<template>
    <div class="w-full flex items-center box-border shrink-0 h-[calc((var(--spacing)*12)+1px)] px-4 border-t border-b">
        <span>
            <UIcon :name="icon ?? ''" />
            {{ channelName }}
        </span>
    </div>
</template>
