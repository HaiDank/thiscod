<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const items = ref<DropdownMenuItem[]>([
    {
        label: "Profile",
        icon: "i-lucide-user",
    },
    {
        label: "Billing",
        icon: "i-lucide-credit-card",
    },
    {
        label: "Settings",
        icon: "i-lucide-cog",
    },
]);
</script>

<template>
    <div class="grow border-t box-border ">
        <UDropdownMenu
            :items="items"
            :content="{
                align: 'center',
                side: 'bottom',
                sideOffset: 8,
            }"
            :ui="{
                content: 'w-48',
            }"
        >
            <button
                class="h-12 w-full border-b font-semibold flex items-center justify-between hover:bg-highlight/50 px-2"
            >
                Server name
                <Icon
                    name="material-symbols:keyboard-arrow-down"
                    size="24"
                    class="text-muted-foreground"
                />
            </button>
        </UDropdownMenu>
    </div>
</template>
