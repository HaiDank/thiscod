<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const createChannelRef = ref();
const items = ref<DropdownMenuItem[]>([

    {
        label: "Create Channels",
        icon: "material-symbols:add-circle",
        onSelect() {
            handleCreateChannel();
        },
    },
]);

function handleCreateChannel() {
    createChannelRef.value?.openModel();
}
</script>

<template>
    <div class="grow border-t border-l box-border rounded-tl-lg">
        <AppCreateChannelModal ref="createChannelRef" />
        <UDropdownMenu
            :items="items"
            :content="{
                align: 'center',
                side: 'bottom',
                sideOffset: 8,
            }"
            size="lg"
            :ui="{
                item: 'flex-row-reverse ',
                itemLabel: 'flex justify-start w-full',
                content: 'w-48',
            }"
        >
            <button
                class="h-12 w-full  border-b font-semibold flex items-center justify-between hover:bg-highlight/50 px-2"
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
