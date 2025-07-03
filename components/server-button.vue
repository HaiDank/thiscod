<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

import { cn } from "~/lib/utils";

const props = defineProps<{
    selected?: boolean;
    highlighted?: boolean;
    icon?: string;
    avatarUrl?: string;
    alt?: string;
    href?: string;
    to?: RouteLocationRaw;
    onClick?: () => void;
}>();

const activeBg = (props.icon || !props.avatarUrl) ? "bg-primary/90 active" : "";
</script>

<template>
    <div class="relative w-full flex items-center">
        <ULink
            as="button"
            :to="to"
            :class="cn('h-10 w-10 rounded-lg text-foreground cursor-pointer flex items-center peer justify-center mx-auto', (icon || !avatarUrl) && 'hover:bg-primary/90')"
            :active-class="activeBg"
            inactive-class="bg-background"
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
        <div :class="cn('peer-[.active]:scale-100 peer-[.active]:opacity-100 peer-[.active]:h-full peer-[.active]:peer-hover:h-full absolute left-0 bg-foreground opacity-80 transition-all duration-300 scale-0 peer-hover:h-2/4 peer-hover:scale-100 h-full rounded-r-full w-1', highlighted && 'scale-100 h-1/5')" />
    </div>
</template>
