export const useServerStore = defineStore("useServerStore", () => {
    const route = useRoute();
    const config = useRuntimeConfig();

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

    const sidebarStore = useSidebarStore();

    watchEffect(() => {
        if (servers.value) {
            sidebarStore.sidebarItems = servers.value.map(server => ({
                id: `${server.id}`,
                avatarUrl: server.image ? `${config.public.s3BucketUrl}/${server.image}` : undefined,
                alt: server.name,
                to: { name: "channels-server", params: { server: server.id } },
            }));
        }
    });

    return {
        servers,
        serversStatus,
        refreshServers,
        currentServer,
        currentServerStatus,
        refreshCurrentServer,
    };
});
