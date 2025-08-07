<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<template>
    <div class="w-full flex items-center gap-4 box-border shrink-0 h-[calc((var(--spacing)*12)+1px)] px-4 border-t border-b">
        <span class="flex items-center justify-center gap-2 cursor-default">
            <slot name="leading" />
            {{ title }}
        </span>
        <slot name="trailing" />
    </div>
</template>
