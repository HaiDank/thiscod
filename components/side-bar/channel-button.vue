<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { FetchError } from "ofetch";
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
    to: RouteLocationRaw;
    id: number;
    icon: string;
    name: string;
}>();
const serverStore = useServerStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const open = ref(false);

const items = ref<DropdownMenuItem[]>([
    {
        label: "Delete Channel",
        icon: "material-symbols:delete-rounded",
        color: "error",
        onSelect() {
            open.value = true;
        },
    },
]);

async function handleDeleteChannel() {
    if (route.params.server) {
        close();
        try {
            await $fetch(`/api/servers/${route.params.server}/${props.id}`, {
                method: "DELETE",
            });
            serverStore.refreshCurrentServer();
            if (route.params.channel && route.params.channel.includes(String(props.id))) {
                router.back();
            }
        }
        catch (e) {
            const error = e as FetchError;
            toast.add({ title: error.statusMessage || "An unknown error occurred", color: "error" });
        }
    }
}

function close() {
    open.value = false;
}
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
        <AppDialog
            confirm-color="error"
            confirm-label="Delete Channel"
            :description="`Are your sure you want to delete ${name}? This cannot be undone.`"
            title="Delete Channel"
            :open="open"
            @on-closed="close"
            @on-confirmed="handleDeleteChannel"
        />
        <UIcon :name="icon" class="text-dimmed group-[.active]:text-default size-5" />
        <span class="grow">

            {{ name }}
        </span>
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
                icon="material-symbols:settings-rounded"
                variant="ghost"
                color="neutral"
                class="bg-transparent hover:bg-transparent cursor-pointer p-0 size-5 group-[.active]:opacity-100 group-hover:opacity-100 opacity-0 transition-all"
            />
        </UDropdownMenu>
    </ULink>
</template>
