<script setup lang="ts">
const { data } = await useFetch("/api/servers", {
    lazy: true,
});
</script>

<template>
    <nav class="w-20 h-full overflow-y-scroll no-scrollbar top-0 pt-1 pb-2 flex flex-col items-center box-border gap-2 border-r ">
        <ServerButton :selected="true" icon="mdi:jellyfish" />
        <div class="w-8 bg-border h-[1px]" />
        <ul v-if="data" class="space-y-2 w-full flex-1">
            <li
                v-for="item in data"
                :key="item.id"
                class="w-full"
            >
                <ServerButton
                    :avatar-url="item.image ? item.image : undefined "
                    :alt="item.name"
                />
            </li>
        </ul>

        <AppCreateServerModal />
    </nav>
</template>
