<script setup lang="ts">
import type { FetchError } from "ofetch";

import getFetchErrorMessage from "~/utils/get-fetch-error-message";

const friendStore = useFriendStore();
const {
    receivedRequestsUsers,
    sentRequestsUsers,
} = storeToRefs(friendStore);

const { $csrfFetch } = useNuxtApp();
const toast = useToast();

async function handleAcceptRequest(id: number) {
    try {
        await $csrfFetch(`/api/friends/requests/accept/${id}`, {
            method: "POST",
        });
        friendStore.refreshFriendRequests();
        friendStore.refreshFriends();
    }
    catch (e) {
        const error = e as unknown as FetchError;
        toast.add({ title: getFetchErrorMessage(error) || "An unknown error occurred", color: "error" });
    }
}

async function handleRejectRequest(id: number) {
    try {
        await $csrfFetch(`/api/friends/requests/reject/${id}`, {
            method: "POST",
        });
        friendStore.refreshFriendRequests();
    }
    catch (e) {
        const error = e as unknown as FetchError;
        toast.add({ title: getFetchErrorMessage(error) || "An unknown error occurred", color: "error" });
    }
}

async function handleCancelRequest(id: number) {
    try {
        await $csrfFetch(`/api/friends/requests/cancel/${id}`, {
            method: "DELETE",
        });
        friendStore.refreshFriendRequests();
    }
    catch (e) {
        const error = e as unknown as FetchError;
        toast.add({ title: getFetchErrorMessage(error) || "An unknown error occurred", color: "error" });
    }
}
</script>

<template>
    <div class="w-full h-full">
        <div v-if="receivedRequestsUsers.length === 0 && sentRequestsUsers.length === 0" class="flex items-center justify-center gap-2 w-full h-full px-2">
            <span>
                There is no pending request
            </span>
        </div>
        <div v-else class="flex flex-col gap-2 w-full h-full px-2">
            <!-- Searchbar -->
            <div class="w-full px-2">
                <UInput
                    trailing-icon="material-symbols:search-rounded"
                    :ui="{
                        base: 'relative shadow-sm bg-sidebar text-base px-4  py-2 ring-1 ring-border/75 focus-visible:ring-blue-500 focus-visible:ring',
                    }"
                    class="w-full"
                    placeholder="Search"
                    variant="subtle"
                />
            </div>

            <div v-if="receivedRequestsUsers.length > 0" class="flex flex-col gap-2">
                <span class="px-2">
                    Received - {{ receivedRequestsUsers.length }}
                </span>
                <FriendListItem
                    v-for="request in receivedRequestsUsers"
                    :key="`received-request-${request.id}`"
                    :user="request"
                    :sub-string="request.email"
                    :with-detail="true"
                >
                    <template #trailing>
                        <UTooltip
                            text="Accept"
                            :delay-duration="0"
                            :content="{
                                align: 'center',
                                sideOffset: 4,
                                side: 'top',
                            }"
                        >
                            <UButton
                                variant="ghost"
                                class="rounded-full hover:text-green-600 group-hover:bg-sidebar hover:bg-sidebar"
                                color="neutral"
                                icon="material-symbols:check-rounded"
                                @click.stop="handleAcceptRequest(request.requestId)"
                            />
                        </UTooltip>
                        <UTooltip
                            text="Ignore"
                            :delay-duration="0"
                            :content="{
                                align: 'center',
                                sideOffset: 4,
                                side: 'top',
                            }"
                        >
                            <UButton
                                variant="ghost"
                                class="rounded-full hover:text-red-600 group-hover:bg-sidebar hover:bg-sidebar"
                                color="neutral"
                                icon="material-symbols:close-rounded"
                                @click.stop="handleRejectRequest(request.requestId)"
                            />
                        </UTooltip>
                    </template>
                </FriendListItem>
            </div>
            <div v-if="sentRequestsUsers.length > 0" class="flex flex-col gap-2">
                <span class="px-2">
                    Sent - {{ sentRequestsUsers.length }}
                </span>
                <FriendListItem
                    v-for="request in sentRequestsUsers"
                    :key="`sent-request-${request.requestId}`"
                    :user="request"
                    :sub-string="request.email"
                    :with-detail="true"
                >
                    <template #trailing>
                        <UTooltip
                            text="Cancel"
                            :delay-duration="0"
                            :content="{
                                align: 'center',
                                sideOffset: 4,
                                side: 'top',
                            }"
                        >
                            <UButton
                                variant="ghost"
                                class="rounded-full hover:text-red-600 group-hover:bg-sidebar hover:bg-sidebar"
                                color="neutral"
                                icon="material-symbols:close-rounded"
                                @click.stop="handleCancelRequest(request.requestId)"
                            />
                        </UTooltip>
                    </template>
                </FriendListItem>
            </div>
        </div>
    </div>
</template>
