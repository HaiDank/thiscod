import type { SelectServerWithChannels } from "~/lib/db/schema";

export const useServerStore = defineStore("useServerStore", () => {
    const route = useRoute();
    const config = useRuntimeConfig();

    const serverAndChannelUrlWithId = computed(() => `/api/servers/${route.params.server}`);

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
    } = useFetch<SelectServerWithChannels>(serverAndChannelUrlWithId, {
        lazy: true,
        immediate: false,
        watch: false,
    });

    const sidebarStore = useSidebarStore();

    watchEffect(() => {
        if (servers.value) {
            sidebarStore.sidebarItems = servers.value.map(server => ({
                id: server.server.id,
                avatarUrl: server.server.image ? `${config.public.s3BucketUrl}/${server.server.image}` : undefined,
                alt: server.server.name,
                to: { name: "channels-server", params: { server: server.server.id } },
            }));
        }
        if (currentServer.value) {
            sidebarStore.sidebarChannelItems = currentServer.value.channels.map(channel => ({
                id: channel.id,
                name: channel.name,
                to: { name: "channels-server-channel", params: { server: currentServer.value!.id, channel: channel.id } },
                icon: channel.channelType === "TEXT" ? "ic:round-numbers" : "material-symbols:volume-up",
            }));
        }

        sidebarStore.serverLoading = serversStatus.value === "pending";
        sidebarStore.channelLoading = currentServerStatus.value === "pending";
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
