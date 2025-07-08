<script setup lang="ts">
import { CONVERSATION_PAGES } from "~/lib/constants";
import { cn } from "~/lib/utils";

const route = useRoute();

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
    <aside class=" min-w-60 max-w-124 h-full bg-sidebar sticky top-0 flex flex-col" :style="{ width: `${elementWidth}px` }">
        <div class="grow flex">
            <SideBarServer />
            <!-- channel bar -->
            <SideBarConversation v-if="CONVERSATION_PAGES.has(route.name?.toString() || '')" />
            <SideBarChannel v-else />
        </div>
        <div class="sticky bottom-0 h-16 p-2 pt-0 box-border bg-sidebar w-full">
            <AppUserUtilBar />
        </div>

        <div
            :class="cn('w-[3px] absolute h-full right-0 transition-all duration-500 cursor-ew-resize hover:scale-x-150 hover:bg-highlight', isResizing && 'bg-highlight scale-x-150')"
            @mousedown.prevent="startResize"
        />
    </aside>
</template>
