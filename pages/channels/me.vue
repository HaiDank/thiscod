<script setup lang="ts">
import { cn } from "~/lib/utils";
import { useFriendStore } from "~/stores/friend";

const sidebarStore = useSidebarStore();
const friendStore = useFriendStore();
const { friends } = storeToRefs(friendStore);

const friendStatusFilter = ref<"Online" | "All" | "Pending" | "Add">("Online");

sidebarStore.setHeaderToFriend();

function handleChangeFetchFilter(value: "Online" | "All" | "Pending") {
    friendStatusFilter.value = value;
    friendStore.fetchFriends(value);
}
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
                        @click="handleChangeFetchFilter('Pending')"
                    >
                        Pending
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
        <div v-if="friendStatusFilter !== 'Add'" class="w-full h-full flex flex-col px-4 gap-2">
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
                :to="{ name: `channel-me-id`,
                       params: {
                           id: friend.id,
                       } }"
                :avatar="friend.image"
                :email="friend.email"
                :name="friend.name"
                :status="friend.status === 'Online' ? 'Online' : 'Offline'"
            />
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
