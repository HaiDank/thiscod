<script setup lang="ts">
const { size = "xl", status = "Online" } = defineProps<{
    size?: "xl" | "2xl" | "md" | "3xs" | "2xs" | "xs" | "sm" | "lg" | "3xl" | undefined;
    avatar?: string;
    name?: string;
    status?: "Online" | "Offline";
}>();

const chipColor = computed(() => status ? { Online: "success", Offline: "neutral" }[status] as any : "Online");
const show = computed(() => status !== "Offline");
</script>

<template>
    <UChip
        inset
        position="bottom-right"
        :size="size"
        :ui="{
            base: `ring-4 ring-border ${!show && 'bg-neutral-500'}`,
        }"
        :color="chipColor"
    >
        <UAvatar
            :src="avatar"
            :alt="name"
            :ui="{
                icon: 'size-full',
            }"
            :size="size"
        />
    </UChip>
</template>
