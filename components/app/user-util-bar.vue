<script setup lang="ts">
import { cn } from "~/lib/utils";

const authStore = useAuthStore();
</script>

<template>
    <div class="sticky rounded-lg bg-card w-full h-full flex items-center px-2 border border-background shadow-md gap-1">
        <UButton
            v-if="authStore.user"
            variant="ghost"
            class="p-0 rounded-tl-2xl rounded-bl-2xl group rounded-tr-md rounded-br-md  grow-1"
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
            <p class="relative flex flex-col items-baseline justify-baseline overflow-hidden w-full">
                <span class="font-semibold text-foreground">
                    {{ authStore.user.name }}
                </span>
                <span
                    :class="cn('flex flex-col transition-all ease-in-out group-hover:-translate-y-full w-full')"
                >
                    <span class="text-disabled scale-y-100 flex items-baseline transition-all group-hover:scale-y-0 font-semibold opacity-100 hover:opacity-0 truncate max-w-full">online</span>
                    <span class="absolute top-full text-disabled font-semibold truncate max-w-full">{{ authStore.user.email }}</span>
                </span>
            </p>
        </UButton>
        <UTooltip
            text="Mute"
            :delay-duration="0"
            :arrow="true"
            :content="{
                align: 'center',
                sideOffset: 4,
            }"
        >
            <UButton
                variant="ghost"
                class="text-disabled hover:text-accent-foreground group p-1"
                color="neutral"
            >
                <Icon
                    class="group-hover:animate-wiggle repeat-2"
                    name="material-symbols:mic"
                    size="22"
                />
            </UButton>
        </UTooltip>
        <UTooltip
            text="Deafen"
            :delay-duration="0"
            :arrow="true"
            :content="{
                align: 'center',
                sideOffset: 4,
            }"
        >
            <UButton
                variant="ghost"
                class="text-disabled hover:text-accent-foreground group p-1"
                color="neutral"
            >
                <Icon
                    class="group-hover:animate-wiggle repeat-2"
                    name="material-symbols:headphones-rounded"
                    size="22"
                />
            </UButton>
        </UTooltip>
        <UTooltip
            text="User Settings"
            :delay-duration="0"
            :arrow="true"
            :content="{
                align: 'center',
                sideOffset: 4,
            }"
        >
            <UButton
                variant="ghost"
                class="text-disabled hover:text-accent-foreground group p-1"
                color="neutral"
            >
                <Icon
                    class="group-hover:animate-spin-ease"
                    name="material-symbols:settings-rounded"
                    size="22"
                />
            </UButton>
        </UTooltip>
    </div>
</template>
