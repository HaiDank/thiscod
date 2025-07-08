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
                content: 'w-48 ',
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
            <SideBarChannelButton
                v-for="item in sidebarChannelItems"
                :id="item.id"
                :key="item.id"
                :to="item.to"
                :icon="item.icon"
                :name="item.name"
            />
        </ul>
    </div>
</template>
