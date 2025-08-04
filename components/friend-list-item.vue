<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
    to: RouteLocationRaw;
    avatar: string | null;
    name: string;
    email: string;
    status: "Online" | "Offline";

}>();

const items = ref<DropdownMenuItem[]>([
    {
        label: "Start Voice Call",
        color: "neutral",
        onSelect() {
        },
    },
    {
        label: "Remove Friend",
        color: "error",
        onSelect() {
        },
    },
]);
</script>

<template>
    <ULink
        as="button"
        :to="to"
        raw
        class="w-full flex items-center group rounded-md py-1 px-2 gap-2 font-semibold"
        active-class="text-default active bg-selected/75"
        inactive-class="text-dimmed hover:text-default hover:bg-highlight"
    >
        <UAvatar :avatar="avatar" :alt="name" />
        <div class="flex gap-2 ">
            <span class="grow font-semibold">
                {{ name }}
            </span>
            <span class="grow font-semibold">
                {{ email }}
            </span>
        </div>
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
            <UButton
                icon="material-symbols:more-vert"
                variant="ghost"
                color="neutral"
                class="bg-transparent hover:bg-transparent cursor-pointer p-0 size-5 group-[.active]:opacity-100 group-hover:opacity-100 opacity-0 transition-all"
            />
        </UDropdownMenu>
    </ULink>
</template>
