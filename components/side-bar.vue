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

const navItems = [
    { label: "Dashboard", to: "/", icon: "lucide:layout-dashboard" },
    { label: "Users", to: "/users", icon: "lucide:users" },
    { label: "Settings", to: "/settings", icon: "lucide:settings" },
];

const authStore = useAuthStore();
const user = authStore.user;
</script>

<template>
    <aside class="w-116 h-full bg-sidebar sticky top-0 flex">
        <div class="w-20 h-full sticky top-0 py-1 flex flex-col items-center box-border gap-2 border-r ">
            <div
                class="w-full"
            >
                <div class=" h-10 w-10 rounded-lg bg-background hover:bg-primary/75  flex items-center justify-center mx-auto">
                    <Icon
                        name="material-symbols:fishfood"
                        size="32"
                    />
                </div>
            </div>
            <div class="w-8 bg-border h-[1px]" />
            <div class="space-y-4 flex flex-col items-center justify-center">
                <nav class="flex-1">
                    <ul class="space-y-2">
                        <li v-for="item in navItems" :key="item.to">
                            <Icon name="material-symbols:server-person" class=" h-[2rem] w-[2rem]" />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="grow border-t box-border ">
            <UDropdownMenu
                :items="items"
                :content="{
                    align: 'start',
                    side: 'bottom',
                    sideOffset: 8,
                }"
                :ui="{
                    content: 'w-48',
                }"
            >
                <button
                    class="h-12 w-full border-b flex items-center justify-between hover:bg-highlight/50 px-2"
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
        <div class="absolute bottom-0 h-16 p-2 pt-0 box-border bg-sidebar w-full">
            <div class="rounded-lg bg-card w-full h-full flex items-center justify-center border border-background shadow-md">
                <UChip inset position="bottom-right">
                    <UAvatar :src="user?.image!" class="size-10" />
                </UChip>
            </div>
        </div>
    </aside>
</template>
