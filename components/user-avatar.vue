<script setup lang="ts">
const { size = "xl", chipSize = "2xl" } = defineProps<{
    size?: "xl" | "2xl" | "md" | "3xs" | "2xs" | "xs" | "sm" | "lg" | "3xl" | undefined;
    chipSize?: "xl" | "2xl" | "md" | "3xs" | "2xs" | "xs" | "sm" | "lg" | "3xl" | undefined;
}>();
const authStore = useAuthStore();
const chipColor = ref<"error" | "neutral" | "primary" | "secondary" | "success" | "info" | "warning">("neutral");
watchEffect(() => {
    if (authStore.user) {
        chipColor.value = "success";
    }
});
</script>

<template>
    <UChip
        inset
        position="bottom-right"
        :size="chipSize"
        :ui="{
            base: 'ring-4 ring-border ',
        }"
        :color="chipColor"
    >
        <UAvatar
            :src="authStore.user?.image ?? undefined"
            :alt="authStore.user?.name"
            icon="material-symbols:account-circle"
            :ui="{
                icon: 'size-full',
            }"
            :size="size"
        />
    </UChip>
</template>
