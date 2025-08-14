<script setup lang="ts">
import type { AppUserDetailPopover } from "#components";

import { cn } from "~/lib/utils";

const authStore = useAuthStore();
const popoverRef = ref<InstanceType<typeof AppUserDetailPopover> | null>(null);

function togglePopover() {
    if (popoverRef.value) {
        popoverRef.value.togglePopover();
    }
}
</script>

<template>
    <AppUserDetailPopover
        v-if="authStore.user"
        ref="popoverRef"
        :user="authStore.user"
    >
        <template #anchor>
            <UButton
                v-if="authStore.user"
                variant="ghost"
                class="p-0 rounded-tl-4xl rounded-bl-4xl group rounded-tr-md rounded-br-md cursor-pointer grow-1"
                color="neutral"
                @click="togglePopover"
            >
                <UserAvatar
                    :avatar="authStore.user.image ?? undefined"
                    :name="authStore.user.name"
                    size="xl"
                    :status="authStore.user ? 'Online' : 'Offline'"
                />
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
    </AppUserDetailPopover>
</template>
