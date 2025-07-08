<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const sidebarStore = useSidebarStore();
const serverStore = useServerStore();
const {
    currentServer,
} = storeToRefs(serverStore);

const {
    sidebarChannelItems,
    channelLoading,
} = storeToRefs(sidebarStore);

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
            v-if="currentServer"
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
                {{ currentServer.name }}
                <Icon
                    name="material-symbols:keyboard-arrow-down"
                    size="24"
                    class="text-muted-foreground"
                />
            </button>
        </UDropdownMenu>

        <ul v-if="sidebarChannelItems && !channelLoading" class="space-y-1 p-2">
            <ULink
                v-for="item in sidebarChannelItems"
                :key="item.id"
                as="button"
                :to="item.to"
                raw
                class="w-full flex items-center group rounded-md py-1 px-2 gap-2 font-semibold"
                active-class="text-default active bg-selected"
                inactive-class="text-dimmed hover:text-default hover:bg-card"
            >
                <UIcon :name="item.icon" class="text-dimmed group-[.active]:text-default size-5" />
                {{ item.name }}
            </ULink>
        </ul>

        <ul v-else-if="channelLoading" class="space-y-1 p-2">
            <USkeleton class="w-full rounded-md h-8" />
        </ul>
    </div>
</template>
