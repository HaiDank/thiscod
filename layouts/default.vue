<script setup lang="ts">
import { cn } from "~/lib/utils";

const isResizing = useIsResizing();
</script>

<template>
    <section :class="cn('w-screen h-screen overflow-hidden', isResizing && 'cursor-ew-resize ')">
        <Header />
        <div class="w-full h-[calc(100vh-2rem)] flex relative">
            <SideBar />
            <div class="w-full h-full flex border border-background">
                <slot />
            </div>
        </div>
    </section>
</template>
