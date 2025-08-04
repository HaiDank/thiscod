import type { User } from "~/lib/db/schema";

export type ClientUser = Omit<User, "status"> & {
    status: "Online" | "Offline";
};

export const useFriendStore = defineStore("useFriendStore", () => {
    const authStore = useAuthStore();
    const friendFetchFilter = ref<"Online" | "All">("Online");

    const {
        data,
        status: friendsStatus,
        refresh: refreshFriends,
    } = useFetch("/api/friends", {
        lazy: true,
    });

    const {
        data: requestsData,
        status: friendRequestsStatus,
        refresh: refreshFriendRequests,
    } = useFetch("/api/friends/requests", {
        lazy: true,
    });

    const friends = ref<ClientUser[]>([]);
    const friendRequests = ref<ClientUser[]>([]);

    watchEffect(() => {
        if (data.value && !!authStore.user) {
            if (friendFetchFilter.value === "Online") {
                data.value.forEach((friend) => {
                    if (friend.userOneId === authStore.user.id) {
                        if (friend.userTwo.status === "Online") {
                            friends.value.push({ ...friend.userTwo, status: "Online" });
                        }
                    }
                    else {
                        if (friend.userOne.status === "Online") {
                            friends.value.push({ ...friend.userOne, status: "Online" });
                        }
                    }
                });
            }
            else {
                data.value.forEach((friend) => {
                    if (friend.userOneId === authStore.user.id) {
                        friends.value.push({ ...friend.userTwo, status: friend.userTwo.status === "Online" ? "Online" : "Offline" });
                    }
                    else {
                        friends.value.push({ ...friend.userOne, status: friend.userOne.status === "Online" ? "Online" : "Offline" });
                    }
                });
            }
        }
    });

    watchEffect(() => {
        if (requestsData.value && !!authStore.user) {
            requestsData.value.forEach((request) => {
                if (request.userOneId === authStore.user.id) {
                    friendRequests.value.push({ ...request.userTwo, status: request.userTwo.status === "Online" ? "Online" : "Offline" });
                }
                else {
                    friendRequests.value.push({ ...request.userOne, status: request.userOne.status === "Online" ? "Online" : "Offline" });
                }
            });
        }
    });

    const fetchFriends = (value: "Online" | "All") => {
        friendFetchFilter.value = value;
        refreshFriends();
    };

    return {
        friends,
        friendsStatus,
        refreshFriends,
        fetchFriends,
        friendRequests,
        friendRequestsStatus,
        refreshFriendRequests,
    };
});
