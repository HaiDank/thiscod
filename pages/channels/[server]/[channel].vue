<script setup lang="ts">
const sidebarStore = useSidebarStore();
const route = useRoute();

const { chosenChannels } = storeToRefs(sidebarStore);
const channel = ref<SidebarChannelItem | undefined>(chosenChannels.value.get(`${route.params.server}`) ?? undefined);
</script>

<template>
    <div class="w-full h-full ">
        <ClientOnly>
            <ChatBox :item="channel" />
        </ClientOnly>
    </div>
</template>

<style scoped>

</style>
