<script setup lang="ts">
const sidebarStore = useSidebarStore();

const route = useRoute();

const {
    sidebarChannelItems,
    channelLoading,
} = storeToRefs(sidebarStore);

function setChosenChannel(item: SidebarChannelItem) {
    sidebarStore.chosenChannels.set(`${route.params.server}`, item);
}
</script>

<template>
    <div class="grow border-t border-l border-r border-r-sidebar box-border rounded-tl-lg">
        <SideBarServerActions />

        <ul v-if="sidebarChannelItems && !channelLoading" class="space-y-1 p-2">
            <SideBarChannelButton
                v-for="item in sidebarChannelItems"
                :id="item.id"
                :key="item.id"
                :to="item.to"
                :icon="item.icon"
                :name="item.name"
                @click="setChosenChannel(item)"
            />
        </ul>
    </div>
</template>
