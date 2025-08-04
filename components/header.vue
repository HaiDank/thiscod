<script setup lang='ts'>
const sidebarStore = useSidebarStore();
const {
    headerItem,
} = storeToRefs(sidebarStore);
</script>

<template>
    <header class="w-screen bg-sidebar h-8 flex items-center justify-center">
        <span class="gap-2 font-semibold flex items-center justify-center">
            <UAvatar
                :icon="headerItem.icon"
                :avatar="headerItem.avatar"
                :alt="headerItem.title"
                class="w-[1rem] h-[1rem]"
                :ui="{
                    root: 'bg-transparent',
                }"
            />
            {{ headerItem.title }}
        </span>
    </header>
</template>
