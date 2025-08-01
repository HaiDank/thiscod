<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import type { FetchError } from "ofetch";

const serverInviteRef = ref();
const createChannelRef = ref();

const openConfirmDialog = ref(false);
const serverStore = useServerStore();
const toast = useToast();
const route = useRoute();
const authStore = useAuthStore();
const socketStore = useSocketStore();
const {
    user,
} = storeToRefs(authStore);

const {
    currentServer,
} = storeToRefs(serverStore);
const isServerOwner = computed(() => user.value?.id === `${currentServer.value?.ownerId}`);

const serverActionLabel = ref("Leave");

const items = ref<DropdownMenuItem[]>([
    {
        label: "Invite People",
        icon: "material-symbols:group-add-rounded",
        onSelect() {
            handleServerInvite();
        },
    },
    {
        label: `Leave Server`,
        icon: "material-symbols:logout-rounded",
        onSelect() {
            openConfirmDialog.value = true;
        },
        color: "error",
    },
]);

watchEffect(() => {
    if (isServerOwner.value) {
        serverActionLabel.value = "Delete";
        items.value = [
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
                label: `Delete Server`,
                icon: "material-symbols:delete-rounded",
                onSelect() {
                    openConfirmDialog.value = true;
                },
                color: "error",
            },
        ];
    }
    else {
        serverActionLabel.value = "Leave";
        items.value = [
            {
                label: "Invite People",
                icon: "material-symbols:group-add-rounded",
                onSelect() {
                    handleServerInvite();
                },
            },
            {
                label: `Leave Server`,
                icon: "material-symbols:logout-rounded",
                onSelect() {
                    openConfirmDialog.value = true;
                },
                color: "error",
            },
        ];
    }
});

function onClose() {
    openConfirmDialog.value = false;
}

function handleServerInvite() {
    serverInviteRef.value?.openModal();
}

function handleCreateChannel() {
    createChannelRef.value?.openModal();
}

async function handleDeleteServer() {
    if (route.params.server) {
        onClose();
        try {
            if (isServerOwner.value) {
                const res = await $fetch(`/api/servers/${route.params.server}`, {
                    method: "DELETE",
                });
                if (res && currentServer.value) {
                    socketStore.leaveServerRoom(currentServer.value.id);
                }
            }
            else {
                const res = await $fetch(`/api/servers/${route.params.server}/members/me`, {
                    method: "DELETE",
                });
                if (res && currentServer.value) {
                    socketStore.leaveServerRoom(currentServer.value.id);
                }
            }
            serverStore.refreshServers();
            await navigateTo({ name: "channels-me" });
        }
        catch (e) {
            const error = e as FetchError;
            toast.add({ title: error.statusMessage || "An unknown error occurred", color: "error" });
        }
    }
}
</script>

<template>
    <div>
        <LazyAppDialog
            :open="openConfirmDialog"
            confirm-color="error"
            :confirm-label="`${serverActionLabel} Server`"
            :description="`Are you sure you want to ${serverActionLabel} ${currentServer?.name}? This action cannot be undone.`"
            :title="`${serverActionLabel} '${currentServer?.name}' `"
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
                class="h-12 w-full border-b box-border font-semibold flex items-center justify-between hover:bg-highlight/50 px-4"
            >
                {{ currentServer.name }}
                <Icon
                    name="material-symbols:keyboard-arrow-down"
                    size="24"
                    class="text-muted-foreground"
                />
            </button>
        </UDropdownMenu>
    </div>
</template>
