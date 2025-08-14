<script setup lang="ts">
import type { User } from "~/lib/db/schema";
import type { MutualFriend, MutualServer } from "~/lib/types";

import { useImageColor } from "~/composables/use-image-color";

const { align = "center", side = "top", sideOffset = 12, user } = defineProps<{
    user: User;
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
}>();

const authStore = useAuthStore();
const toast = useToast();
const isUser = computed(() => `${authStore.user?.id}` === `${user.id}`);
const open = ref(false);
const rgbString = ref<string>("rgb(255,255,255)");
const { getAverageRGB } = useImageColor();

const { data: mutualServersData, status: mutualServersStatus, error: mutualServersError, refresh: refreshMutualServers } = useFetch(`/api/users/${user.id}/mutual-servers`, {
    lazy: true,
    watch: false,
    immediate: false,
    transform(payload: MutualServer[]) {
        return {
            data: payload,
            fetchedAt: new Date(),
        };
    },
    getCachedData(key: string, nuxtApp) {
        const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        console.log("server", key, data);
        if (!data) {
            return;
        }
        const expiration = new Date(data.fetchedAt);
        expiration.setTime(expiration.getTime() + 60 * 1000);
        const isExpired = expiration.getTime() < Date.now();

        if (isExpired) {
            return;
        }

        return data;
    },
});

const { data: mutualFriendsData, status: mutualFriendsStatus, error: mutualFriendsError, refresh: refreshMutualFriends } = useFetch(`/api/users/${user.id}/mutual-friends`, {
    lazy: true,
    watch: false,
    immediate: false,
    transform(payload: MutualFriend[]) {
        return {
            data: payload,
            fetchedAt: new Date(),
        };
    },
    getCachedData(key: string, nuxtApp) {
        const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
        console.log("friend", key, data);
        if (!data) {
            return;
        }
        const expiration = new Date(data.fetchedAt);
        expiration.setTime(expiration.getTime() + 60 * 1000);
        const isExpired = expiration.getTime() < Date.now();

        if (isExpired) {
            return;
        }

        return data;
    },
});

function togglePopover() {
    open.value = !open.value;
}

defineExpose({
    togglePopover,
});
watchEffect(async () => {
    if (!isUser.value) {
        await refreshMutualFriends();
        await refreshMutualServers();
        if (mutualServersError.value) {
            toast.add({
                title: "An error occured",
                description: getFetchErrorMessage(mutualServersError.value),
                color: "error",
            });
        }
        if (mutualFriendsError.value) {
            toast.add({
                title: "An error occured",
                description: getFetchErrorMessage(mutualFriendsError.value),
                color: "error",
            });
        }
    }
});

watchPostEffect(async () => {
    if (user && user.image) {
        const res = await getAverageRGB(`${user.image}`);
        rgbString.value = `rgb(${res[0]},${res[1]},${res[2]})`;
    }
});
</script>

<template>
    <UPopover
        v-model:open="open"
        mode="click"
        :content="{
            align,
            side,
            sideOffset,
        }"
    >
        <template #anchor>
            <slot name="anchor" />
        </template>

        <template #content>
            <div class="flex flex-col w-80 rounded-lg overflow-hidden shadow-2xl bg-accent gap-4">
                <div
                    class="h-30 max-h-1/2 relative"
                    :style="{
                        backgroundColor: rgbString,
                    }"
                >
                    <div class="absolute bottom-0 left-4 translate-y-1/2">
                        <UserAvatar
                            root-style="size-16 text-4xl ring-6 ring-accent"
                            chip-style="ring-6 ring-accent size-4"
                            :avatar="user.image ?? undefined"
                            :name="user.name"
                        />
                    </div>
                </div>
                <div class="p-4 flex flex-col gap-2">
                    <div>
                        <h5 class="text-xl font-bold mt-1">
                            {{ user.name }}
                        </h5>
                        <span class="text-sm ">
                            {{ user.email }}
                        </span>
                    </div>
                    <div v-if="isUser" class="flex flex-col gap-2 p-2 rounded-md shadow-md bg-highlight mt-2">
                        <div class="rounded-md  bg-highlight">
                            edit profile
                        </div>
                    </div>
                    <div v-else class="flex flex-col gap-2 text-xs text-dimmed">
                        <div class="flex items-center gap-2">
                            <div v-if="mutualFriendsStatus !== 'pending' && mutualFriendsData && mutualFriendsData.data.length > 0" class="flex items-center gap-2">
                                <UAvatarGroup size="3xs" :max="3">
                                    <UAvatar
                                        v-for="friend in mutualFriendsData.data"
                                        :key="`friend-${friend.id}`"
                                        :alt="friend.name"
                                        :src="friend.image ?? undefined"
                                    />
                                </UAvatarGroup>
                                {{ mutualFriendsData.data.length }} mutual {{ mutualFriendsData.data.length > 1 ? 'friends' : 'friend' }}
                            </div>
                            <div v-if="mutualServersStatus !== 'pending' && mutualServersData && mutualServersData.data.length > 0" class="flex items-center gap-2">
                                <UAvatarGroup
                                    v-if="!mutualFriendsData || mutualFriendsData.data.length === 0"
                                    size="3xs"
                                    :max="3"
                                >
                                    <UAvatar
                                        v-for="server in mutualServersData.data"
                                        :key="`server-${server.id}`"
                                        :alt="server.name"
                                        :src="server.image ?? undefined"
                                    />
                                </UAvatarGroup>
                                <span v-else class="font-bold">
                                    ·
                                </span>
                                {{ mutualServersData.data.length }} mutual {{ mutualServersData.data.length > 1 ? 'servers' : 'server' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </UPopover>
</template>
