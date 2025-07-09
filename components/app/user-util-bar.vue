<script setup lang="ts">

</script>

<template>
    <div class="sticky rounded-lg bg-card w-full h-full flex items-center px-2 border border-background shadow-md gap-1">
        <AppAvatarChip />
        <UTooltip
            text="Mute"
            :delay-duration="0"
            arrow
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
        <AppUserSetting />
    </div>
</template>
