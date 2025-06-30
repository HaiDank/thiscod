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
        <div class="w-20 h-full overflow-y-scroll no-scrollbar top-0 py-1 flex flex-col items-center box-border gap-2 border-r ">
            <ServerButton :highlighted="true" icon="material-symbols:fishfood" />
            <div class="w-8 bg-border h-[1px]" />
            <div class="space-y-4 flex flex-col items-center justify-center grow-1">
                <nav class="flex-1">
                    <ul class="space-y-2">
                        <li v-for="item in navItems" :key="item.to">
                            <ServerButton :icon="item.icon" />
                        </li>
                    </ul>
                </nav>
            </div>

            <ServerButton />
        </div>

        <!-- channel bar -->
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
            <AppUserUtilBar />
        </div>

        <div
            :class="cn('w-[3px] absolute h-full right-0 transition-all duration-500 cursor-ew-resize hover:scale-x-150 hover:bg-highlight', isResizing && 'bg-highlight scale-x-150')"
            @mousedown.prevent="startResize"
        />
    </aside>
</template>
