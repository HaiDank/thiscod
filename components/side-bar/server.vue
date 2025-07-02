<script setup lang="ts">
const navItems = [
    { label: "Dashboard", to: "/", icon: "lucide:layout-dashboard" },
    { label: "Users", to: "/users", icon: "lucide:users" },
    { label: "Settings", to: "/settings", icon: "lucide:settings" },
];
</script>

<template>
    <nav class="w-20 h-full overflow-y-scroll no-scrollbar top-0 pt-1 pb-2 flex flex-col items-center box-border gap-2 border-r ">
        <ServerButton :selected="true" icon="mdi:jellyfish" />
        <div class="w-8 bg-border h-[1px]" />
        <ul class="space-y-2 w-full flex-1">
            <li
                v-for="item in navItems"
                :key="item.to"
                class="w-full"
            >
                <ServerButton :icon="item.icon" />
            </li>
        </ul>

        <AppCreateServerModal />
    </nav>
</template>
