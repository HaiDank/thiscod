<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const items = ref<DropdownMenuItem[]>([
    {
        label: "Create Channels",
        icon: "material-symbols:add-circle",

    },
]);
</script>

<template>
    <div class="grow border-t border-l box-border rounded-tl-lg">
        <UDropdownMenu
            :items="items"
            :content="{
                side: 'bottom',
                sideOffset: 8,
            }"
            size="lg"
            :ui="{
                item: 'flex-row-reverse justify-between px-1',
                itemLabel: 'w-full text-start',
                content: 'w-48 p-1',
            }"
        >
            <button
                class="h-12 w-full border-b font-semibold flex items-center justify-between hover:bg-highlight/50 px-4"
            >
                Create DM
                <Icon
                    name="material-symbols:keyboard-arrow-down"
                    size="24"
                    class="text-muted-foreground"
                />
            </button>
        </UDropdownMenu>
    </div>
</template>
