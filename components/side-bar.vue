<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

import { cn } from "~/lib/utils";

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

const isResizing = useIsResizing();
const elementWidth = ref(420);
let initialMouseX = 0;
let initialWidth = 0;

function startResize(event: MouseEvent) {
    isResizing.value = true;
    initialMouseX = event.clientX;
    initialWidth = elementWidth.value;
    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
}

function handleResize(event: MouseEvent) {
    if (!isResizing.value)
        return;
    const deltaX = event.clientX - initialMouseX;
    elementWidth.value = Math.max(240, initialWidth + deltaX); // Ensure minimum width
}

function stopResize() {
    isResizing.value = false;
    window.removeEventListener("mousemove", handleResize);
    window.removeEventListener("mouseup", stopResize);
}
</script>

<template>
    <aside class=" min-w-60 max-w-124 h-full bg-sidebar sticky top-0 flex" :style="{ width: `${elementWidth}px` }">
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
                    align: 'center',
                    side: 'bottom',
                    sideOffset: 8,
                }"
                :ui="{
                    content: 'w-48',
                }"
            >
                <button
                    class="h-12 w-full border-b font-semibold flex items-center justify-between hover:bg-highlight/50 px-2"
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
            <div class="rounded-lg bg-card w-full h-full flex items-center px-2 border border-background shadow-md">
                <UButton
                    v-if="authStore.user"
                    variant="ghost"
                    class="p-0  rounded-tl-2xl rounded-bl-2xl rounded-tr-md rounded-br-md text-accent-foreground font-semibold grow-1"
                    color="neutral"
                >
                    <UChip
                        inset
                        position="bottom-right"
                        color="success"
                    >
                        <UAvatar
                            v-if="authStore.user"
                            :src="authStore.user.image ?? undefined"
                            :alt="authStore.user.name"
                            class="size-10"
                        />
                    </UChip>
                    <p>
                        <span>
                            {{ authStore.user.name }}
                        </span>
                    </p>
                </UButton>
            </div>
        </div>

        <div
            :class="cn('w-[3px] absolute h-full right-0 transition-all duration-500 cursor-ew-resize hover:scale-x-150 hover:bg-highlight', isResizing && 'bg-highlight scale-x-150')"
            @mousedown.prevent="startResize"
        />
    </aside>
</template>
