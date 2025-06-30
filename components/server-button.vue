<script setup lang="ts">
import { cn } from "~/lib/utils";

defineProps<{
    selected?: boolean;
    highlighted?: boolean;
    icon?: string;
    avatarUrl?: string;
    alt?: string;
    onClick?: () => void;
}>();
</script>

<template>
    <div class="relative w-full flex items-center">
        <div :class="cn(' h-10 w-10 rounded-lg bg-background flex items-center peer justify-center mx-auto', icon && 'hover:bg-primary/90', selected && icon && 'bg-primary/90')" @click="onClick">
            <UAvatar
                :icon="icon"
                :alt="alt"
                :src="avatarUrl"
                :ui="{
                    root: 'rounded-none bg-inherit/0',
                    icon: 'size-6',
                }"
            />
        </div>
        <div :class="cn('absolute left-0 bg-foreground opacity-80 transition-all duration-300 scale-0 peer-hover:h-3/4 peer-hover:scale-100 h-full rounded-r-full w-1', selected && 'scale-100 opacity-100 h-full peer-hover:h-full', highlighted && 'scale-100 h-1/4')" />
    </div>
</template>
