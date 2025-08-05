import type { User } from "~/lib/db/schema";

export type ClientUser = Omit<User, "status"> & {
    status: "Online" | "Offline";
};

type FriendRequestData = ClientUser & { requestId: number };

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
    const receivedRequestsUsers = ref<FriendRequestData[]>([]);
    const sentRequestsUsers = ref<FriendRequestData[]>([]);

    watchEffect(() => {
        if (data.value && !!authStore.user) {
            if (friendFetchFilter.value === "Online") {
                const array: ClientUser[] = [];
                data.value.forEach((friend) => {
                    if (friend.userOneId === authStore.user!.id) {
                        if (friend.userTwo.status === "Online") {
                            array.push({ ...friend.userTwo, status: "Online" });
                        }
                    }
                    else {
                        if (friend.userOne.status === "Online") {
                            array.push({ ...friend.userOne, status: "Online" });
                        }
                    }
                });
                friends.value = array;
            }
            else {
                friends.value = data.value.map((friend) => {
                    if (friend.userOneId === authStore.user!.id) {
                        return { ...friend.userTwo, status: friend.userTwo.status === "Online" ? "Online" : "Offline" };
                    }
                    else {
                        return { ...friend.userOne, status: friend.userOne.status === "Online" ? "Online" : "Offline" };
                    }
                });
            }
        }
    });

    watchEffect(() => {
        if (requestsData.value && !!authStore.user) {
            const received: FriendRequestData[] = [];
            const sent: FriendRequestData[] = [];

            requestsData.value.forEach((request) => {
                if (request.userOneId === authStore.user!.id) {
                    if (request.actionUserId === authStore.user!.id) {
                        sent.push({ ...request.userTwo, status: request.userTwo.status === "Online" ? "Online" : "Offline", requestId: request.id });
                    }
                    else {
                        received.push({ ...request.userTwo, status: request.userTwo.status === "Online" ? "Online" : "Offline", requestId: request.id });
                    }
                }
                else {
                    if (request.actionUserId === authStore.user!.id) {
                        sent.push({ ...request.userOne, status: request.userOne.status === "Online" ? "Online" : "Offline", requestId: request.id });
                    }
                    else {
                        received.push({ ...request.userOne, status: request.userOne.status === "Online" ? "Online" : "Offline", requestId: request.id });
                    }
                }
            });

            sentRequestsUsers.value = sent;
            receivedRequestsUsers.value = received;
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
        sentRequestsUsers,
        receivedRequestsUsers,
        friendRequestsStatus,
        refreshFriendRequests,
        requestsData,
    };
});
