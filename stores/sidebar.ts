import type { RouteLocationRaw } from "vue-router";

export type SidebarItem = {
    id?: number;
    icon?: string;
    avatarUrl?: string;
    alt?: string;
    href?: string;
    to: RouteLocationRaw;
};

export type SidebarChannelItem = {
    id: number;
    name: string;
    to: RouteLocationRaw;
    icon: string;
};

export type HeaderItem = {
    icon?: string;
    title: string;
    avatar?: string | null;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const topSidebarItem = ref<SidebarItem>({
        icon: "mdi:jellyfish",
        to: { name: "channels-me" },
    });
    const headerItem = ref<HeaderItem>({
        icon: "material-symbols:person-raised-hand-rounded",
        title: "Friends",
    });

    const setHeaderToFriend = () => {
        headerItem.value = {
            icon: "material-symbols:person-raised-hand-rounded",
            title: "Friends",
        };
    };

    const setHeaderToDM = () => {
        headerItem.value = {
            icon: "mdi:jellyfish",
            title: "Direct Messages",
        };
    };

    const setHeaderToServer = (avatar: string, title: string) => {
        headerItem.value = {
            avatar,
            title,
        };
    };

    const sidebarItems = ref<SidebarItem[]>([]);
    const sidebarChannelItems = ref<SidebarChannelItem[]>([]);
    const sidebarConversationItems = ref<SidebarItem[]>([]);
    const chosenChannels = ref<Map<string, SidebarChannelItem>>(new Map());
    const channelLoading = ref(true);
    const serverLoading = ref(true);

    return {
        headerItem,
        topSidebarItem,
        serverLoading,
        channelLoading,
        sidebarItems,
        sidebarConversationItems,
        sidebarChannelItems,
        chosenChannels,
        setHeaderToDM,
        setHeaderToFriend,
        setHeaderToServer,
    };
});
