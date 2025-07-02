<script setup lang="ts">
import { cn } from "~/lib/utils";

defineProps<{
    selected?: boolean;
    highlighted?: boolean;
    icon?: string;
    avatarUrl?: string;
    alt?: string;
    href?: string;
    onClick?: () => void;
}>();
</script>

<template>
    <div class="relative w-full flex items-center">
        <ULink
            as="button"
            :href="href"
            :class="cn(' h-10 w-10 rounded-lg bg-background cursor-pointer flex items-center peer justify-center mx-auto', (icon || !avatarUrl) && 'hover:bg-primary/90', selected && (icon || !avatarUrl) && 'bg-primary/90')"
            @click="onClick"
        >
            <UAvatar
                :icon="icon"
                :alt="alt"
                :src="avatarUrl"
                :ui="{
                    root: 'rounded-none bg-inherit/0 ',
                    icon: 'size-6',
                    fallback: 'font-semibold',
                }"
            />
        </ULink>
        <div :class="cn('absolute left-0 bg-foreground opacity-80 transition-all duration-300 scale-0 peer-hover:h-2/4 peer-hover:scale-100 h-full rounded-r-full w-1', selected && 'scale-100 opacity-100 h-full peer-hover:h-full', highlighted && 'scale-100 h-1/5')" />
    </div>
</template>
