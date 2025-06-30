<script setup lang="ts">
import { cn } from "~/lib/utils";

defineProps<{
    selected?: boolean;
    highlighted?: boolean;
    icon?: string;
    avatarUrl?: string;
    alt?: string;
}>();
</script>

<template>
    <div class="relative w-full  flex items-center">
        <!-- <div v-if="!avatarUrl && icon" class=" h-10 w-10 rounded-lg bg-background hover:bg-primary/90 peer flex items-center justify-center mx-auto">
            <Icon
                :name="icon"
                size="32"
            />
        </div> -->

        <div :class="cn(' h-10 w-10 rounded-lg bg-background flex items-center peer justify-center mx-auto', icon && 'hover:bg-primary/90')">
            <UAvatar
                :icon="icon"
                :alt="alt"
                :src="avatarUrl"
                :ui="{
                    root: 'rounded-none bg-inherit/0',
                    icon: 'size-8',
                }"
            />
        </div>
        <div :class="cn('absolute left-0  bg-foreground opacity-80 transition-all duration-300 scale-0 peer-hover:h-3/4 hover:scale-x-100 h-full rounded-r-full w-1', selected && 'scale-100 opacity-100 h-full', highlighted && 'scale-100 h-1/4')" />
    </div>
</template>
