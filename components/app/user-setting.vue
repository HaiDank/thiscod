<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const items = ref<DropdownMenuItem[]>([
    {
        label: "Log out",
        icon: "material-symbols:logout-rounded",
        color: "error",
        onSelect() {
            Logout();
        },
    },
]);

const authStore = useAuthStore();
const toast = useToast();

async function Logout() {
    const { error } = await authStore.signOut();

    if (error && error.message) {
        toast.add({
            color: "error",
            title: error.message,
        });
    }
}
</script>

<template>
    <UDropdownMenu
        :items="items"
        :content="{
            side: 'top',
            sideOffset: 8,
        }"
        :ui="{
            content: 'w-48',
        }"
    >
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
    </UDropdownMenu>
</template>
