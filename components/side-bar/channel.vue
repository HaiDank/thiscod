<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { FetchError } from "ofetch";

const sidebarStore = useSidebarStore();
const serverStore = useServerStore();
const toast = useToast();
const route = useRoute();
const openConfirmDialog = ref(false);
const {
    currentServer,
} = storeToRefs(serverStore);

const {
    sidebarChannelItems,
    channelLoading,
} = storeToRefs(sidebarStore);

const createChannelRef = ref();
const serverInviteRef = ref();
const items = ref<DropdownMenuItem[]>([
    {
        label: "Invite People",
        icon: "material-symbols:group-add-rounded",
        onSelect() {
            handleServerInvite();
        },
    },
    {
        label: "Create Channels",
        icon: "material-symbols:add-circle",
        onSelect() {
            handleCreateChannel();
        },
    },
    {
        label: "Delete Server",
        icon: "material-symbols:delete-rounded",
        onSelect() {
            openConfirmDialog.value = true;
        },
        color: "error",
    },
]);

async function handleDeleteServer() {
    if (route.params.server) {
        close();
        try {
            await $fetch(`/api/servers/${route.params.server}`, {
                method: "DELETE",
            });
            serverStore.refreshServers();
            navigateTo({ name: "channels-me" });
        }
        catch (e) {
            const error = e as FetchError;
            toast.add({ title: error.statusMessage || "An unknown error occurred", color: "error" });
        }
    }
}

function onClose() {
    openConfirmDialog.value = false;
}

function handleServerInvite() {
    serverInviteRef.value?.openModal();
}

function handleCreateChannel() {
    createChannelRef.value?.openModal();
}
</script>

<template>
    <div class="grow border-t border-l box-border rounded-tl-lg">
        <LazyAppDialog
            v-if="currentServer"
            :open="openConfirmDialog"
            confirm-color="error"
            confirm-label="Delete Server"
            :description="`Are you sure you want to delete ${currentServer.name} server? This action cannot be undone.`"
            :title="`Delete '${currentServer.name}'' server`"
            @on-closed="onClose"
            @on-confirmed="handleDeleteServer"
        />
        <LazyAppServerInviteModal ref="serverInviteRef" />
        <LazyAppCreateChannelModal ref="createChannelRef" />
        <UDropdownMenu
            v-if="currentServer"
            :items="items"
            :content="{
                side: 'bottom',
                sideOffset: 8,
            }"
            size="lg"
            :ui="{
                content: 'w-48 ',
            }"
        >
            <button
                class="h-12 w-full border-b font-semibold flex items-center justify-between hover:bg-highlight/50 px-4"
            >
                {{ currentServer.name }}
                <Icon
                    name="material-symbols:keyboard-arrow-down"
                    size="24"
                    class="text-muted-foreground"
                />
            </button>
        </UDropdownMenu>

        <ul v-if="sidebarChannelItems && !channelLoading" class="space-y-1 p-2">
            <SideBarChannelButton
                v-for="item in sidebarChannelItems"
                :id="item.id"
                :key="item.id"
                :to="item.to"
                :icon="item.icon"
                :name="item.name"
            />
        </ul>
    </div>
</template>
