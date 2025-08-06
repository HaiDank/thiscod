<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

import { cn } from "~/lib/utils";
import { useFriendStore } from "~/stores/friend";

const sidebarStore = useSidebarStore();
const friendStore = useFriendStore();
const { friends, receivedRequestsUsers } = storeToRefs(friendStore);

const friendStatusFilter = ref<"Online" | "All" | "Pending" | "Add">("Online");

sidebarStore.setHeaderToFriend();

function handleFetchPendingRequest() {
    friendStatusFilter.value = "Pending";
    friendStore.refreshFriendRequests();
}

function handleChangeFetchFilter(value: "Online" | "All") {
    friendStatusFilter.value = value;
    friendStore.fetchFriends(value);
}

const items = ref<DropdownMenuItem[]>([
    {
        label: "Start Voice Call",
        color: "neutral",
        onSelect() {
        },
    },
    {
        label: "Remove Friend",
        color: "error",
        onSelect() {
        },
    },
]);
</script>

<template>
    <section class="w-full h-full bg-background flex flex-col gap-2 grow-0">
        <!-- Header -->
        <div class="w-full flex items-center box-border shrink-0 h-[calc((var(--spacing)*12)+1px)] px-4 border-t border-b gap-4">
            <span class="flex items-center justify-center gap-2 cursor-default">
                <UIcon name="material-symbols:person-raised-hand-rounded" class="text-dimmed" />
                Friends
            </span>
            <span class="text-dimmed/50 text-xl cursor-default">
                •
            </span>
            <ul class="flex items-center justify-center gap-4">
                <li>
                    <UButton
                        :class="cn('px-4 hover:bg-accent font-semibold cursor-pointer', friendStatusFilter === 'Online' && 'hover:bg-elevated')"
                        variant="link"
                        :active="friendStatusFilter === 'Online'"
                        active-color="neutral"
                        active-variant="soft"
                        color="neutral"
                        @click="handleChangeFetchFilter('Online')"
                    >
                        Online
                    </UButton>
                </li>
                <li>
                    <UButton
                        :class="cn('px-4 hover:bg-accent font-semibold cursor-pointer', friendStatusFilter === 'All' && 'hover:bg-elevated')"
                        variant="link"
                        :active="friendStatusFilter === 'All'"
                        active-color="neutral"
                        active-variant="soft"
                        color="neutral"
                        @click="handleChangeFetchFilter('All')"
                    >
                        All
                    </UButton>
                </li>
                <li>
                    <UButton
                        :class="cn('px-4 hover:bg-accent font-semibold cursor-pointer', friendStatusFilter === 'Pending' && 'hover:bg-elevated')"
                        variant="link"
                        :active="friendStatusFilter === 'Pending'"
                        active-color="neutral"
                        active-variant="soft"
                        color="neutral"
                        @click="handleFetchPendingRequest"
                    >
                        Pending
                        <template v-if="receivedRequestsUsers && receivedRequestsUsers.length > 0" #trailing>
                            <UChip
                                standalone
                                inset
                                :ui="{
                                    base: 'text-default text-[10px] size-4 font-bold dark:bg-red-600  ring-0 text-center ',
                                }"
                                color="error"
                                :text="receivedRequestsUsers.length"
                            />
                        </template>
                    </UButton>
                </li>
                <li>
                    <UButton
                        class="px-4 font-semibold text-default hover:text-default cursor-pointer "
                        variant="link"
                        :active="friendStatusFilter === 'Add'"
                        inactive-class="bg-primary"
                        active-class="text-primary"
                        active-variant="soft"
                        color="primary"
                        @click="friendStatusFilter = 'Add'"
                    >
                        Add Friend
                    </UButton>
                </li>
            </ul>
        </div>

        <!-- page -->
        <div v-if="friendStatusFilter === 'Online' || friendStatusFilter === 'All'" class="w-full h-full flex flex-col px-4 gap-2">
            <!-- Searchbar -->
            <UInput
                trailing-icon="material-symbols:search-rounded"
                :ui="{
                    base: 'relative shadow-sm bg-sidebar text-base px-4 py-2 ring-1 ring-border/75 focus-visible:ring-blue-500 focus-visible:ring',
                }"
                class="w-full"
                placeholder="Search"
                variant="subtle"
            />
            <!-- title -->
            <h5 class="text-sm mt-2">
                {{ friendStatusFilter }} friends - 0
            </h5>

            <!-- friend list -->
            <FriendListItem
                v-for="friend in friends"
                :key="`${friend.id}`"
                :on-click="() => {}"
                :avatar="friend.image"
                :email="friend.email"
                :name="friend.name"
                :sub-string="friend.status === 'Online' ? 'Online' : 'Offline'"
            >
                <template #trailing>
                    <UTooltip
                        text="Message"
                        :delay-duration="0"
                        :content="{
                            align: 'center',
                            sideOffset: 4,
                            side: 'top',
                        }"
                    >
                        <UButton
                            icon="mdi:chat"
                            variant="ghost"
                            class="rounded-full group-hover:bg-sidebar hover:bg-sidebar cursor-pointer"
                            color="neutral"
                        />
                    </UTooltip>
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
                        <UTooltip
                            text="More"
                            :delay-duration="0"
                            :content="{
                                align: 'center',
                                sideOffset: 4,
                                side: 'top',
                            }"
                        >
                            <UButton
                                icon="material-symbols:more-vert"
                                variant="ghost"
                                class="rounded-full group-hover:bg-sidebar hover:bg-sidebar cursor-pointer"
                                color="neutral"
                            />
                        </UTooltip>
                    </UDropdownMenu>
                </template>
            </FriendListItem>
        </div>

        <!-- pending request -->

        <FriendRequestsList v-if="friendStatusFilter === 'Pending'" />

        <!-- add friend -->
        <div v-if="friendStatusFilter === 'Add'" class="w-full  flex flex-col px-4 pb-4 gap-2 border-b border-border">
            <!-- title -->
            <h5 class="text-xl font-bold mt-2">
                Add friend
            </h5>
            <p>
                You can add friends with their email.
            </p>

            <!-- Email Input -->

            <AddFriendInput />
        </div>
    </section>
</template>
