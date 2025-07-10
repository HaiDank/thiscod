<script setup lang="ts">
const sidebarStore = useSidebarStore();
const {
    sidebarItems,
} = storeToRefs(sidebarStore);
</script>

<template>
    <nav class="w-20 h-full overflow-y-scroll no-scrollbar top-0 pt-1 pb-2 flex flex-col items-center box-border gap-2 ">
        <ServerButton
            icon="mdi:jellyfish"
            :to="{ name: 'channels-me' }"
        />
        <div class="w-8 border-t h-[1px]" />
        <div class="w-full flex-1 space-y-2">
            <ul v-if="sidebarItems" class="space-y-2">
                <li
                    v-for="item in sidebarItems"
                    :key="`server-${item.id}`"
                    class="w-full"
                >
                    <ServerButton
                        :avatar-url="item.avatarUrl"
                        :alt="item.alt"
                        :to="item.to"
                    />
                </li>
            </ul>
            <AppCreateServerModal />
        </div>
        <ModeToggle />
    </nav>
</template>
