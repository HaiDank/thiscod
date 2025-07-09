<script setup lang="ts">
import { cn } from "~/lib/utils";

const authStore = useAuthStore();
const chipColor = ref<"error" | "neutral" | "primary" | "secondary" | "success" | "info" | "warning">("neutral");
onMounted(() => {
    if (authStore.user) {
        chipColor.value = "success";
    }
});
</script>

<template>
    <UButton
        v-if="authStore.user"
        variant="ghost"
        class="p-0 rounded-tl-2xl rounded-bl-2xl group rounded-tr-md rounded-br-md  grow-1"
        color="neutral"
    >
        <UChip
            inset
            position="bottom-right"
            :color="chipColor"
        >
            <UAvatar
                :src="authStore.user.image ?? undefined"
                :alt="authStore.user?.name"
                icon="material-symbols:account-circle"
                class="size-10"
            />
        </UChip>
        <p class="relative flex flex-col items-baseline justify-baseline overflow-hidden w-full">
            <span class="font-semibold text-foreground">
                {{ authStore.user.name }}
            </span>
            <span
                :class="cn('flex flex-col transition-all ease-in-out group-hover:-translate-y-full w-full')"
            >
                <span class="text-disabled scale-y-100 flex items-baseline transition-all group-hover:scale-y-0  text-xs opacity-100 hover:opacity-0 truncate max-w-full">{{ authStore.user ? 'online' : 'offline' }}</span>
                <span class="absolute top-full text-disabled text-xs truncate max-w-full">{{ authStore.user.email }}</span>
            </span>
        </p>
    </UButton>
</template>
