import type { RouteLocationRaw } from "vue-router";

export type SidebarItem = {
    id: string;
    icon?: string;
    avatarUrl?: string;
    alt?: string;
    href?: string;
    to?: RouteLocationRaw;
};

export type SidebarChannelItem = {
    id: string;
    name: string;
    to?: RouteLocationRaw;
    icon: string;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItem[]>([]);
    const sidebarChannelItems = ref<SidebarChannelItem[]>([]);
    const sidebarConversationItems = ref<SidebarItem[]>([]);
    const channelLoading = ref(false);
    const serverLoading = ref(false);

    return {
        serverLoading,
        channelLoading,
        sidebarItems,
        sidebarConversationItems,
        sidebarChannelItems,
    };
});
