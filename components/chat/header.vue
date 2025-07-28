<script setup lang="ts">
import type { ChannelType } from "~/lib/types";

defineProps<{
    channelName?: string;
    type?: ChannelType | null;
}>();
</script>

<template>
    <div class="w-full flex items-center box-border shrink-0 h-[calc((var(--spacing)*12)+1px)] px-4 border-t border-b">
        <span>
            <UIcon :name="type === 'TEXT' ? 'ic:round-numbers' : 'material-symbols:volume-up'" />
            {{ channelName }}
        </span>
    </div>
</template>
