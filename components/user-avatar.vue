<script setup lang="ts">
const { size = "xl", status = "Online", chipStyle = "ring-4 ring-border", className = "" } = defineProps<{
    size?: "xl" | "2xl" | "md" | "3xs" | "2xs" | "xs" | "sm" | "lg" | "3xl" | undefined;
    rootStyle?: string;
    chipStyle?: string;
    avatar?: string;
    name?: string;
    status?: "Online" | "Offline";
    className?: string;
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
            base: `${!show && 'bg-neutral-500'} ${chipStyle}`,
        }"
        :color="chipColor"
    >
        <UAvatar
            :class="`${className}`"
            :src="avatar"
            :alt="name"
            :ui="{
                icon: 'size-full',
                root: rootStyle,
            }"
            :size="size"
        />
    </UChip>
</template>
