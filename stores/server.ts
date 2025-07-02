export const useServerStore = defineStore("useServerStore", () => {
    const route = useRoute();

    const serverAndChannelUrlWithId = computed(() => `/api/server/${route.params.id}`);

    const {
        data: servers,
        status: serversStatus,
        refresh: refreshServers,
    } = useFetch("/api/servers", {
        lazy: true,
    });

    const {
        data: currentServer,
        status: currentServerStatus,
        refresh: refreshCurrentServer,
    } = useFetch(serverAndChannelUrlWithId);

    return {
        servers,
        serversStatus,
        refreshServers,
        currentServer,
        currentServerStatus,
        refreshCurrentServer,
    };
});
