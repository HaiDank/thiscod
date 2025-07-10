import type { RouteLocationRaw } from "vue-router";

export type SidebarItem = {
    id: number;
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

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItem[]>([]);
    const sidebarChannelItems = ref<SidebarChannelItem[]>([]);
    const sidebarConversationItems = ref<SidebarItem[]>([]);
    const chosenChannels = ref<Map<string, SidebarChannelItem>>(new Map());
    const channelLoading = ref(true);
    const serverLoading = ref(true);

    return {
        serverLoading,
        channelLoading,
        sidebarItems,
        sidebarConversationItems,
        sidebarChannelItems,
        chosenChannels,
    };
});
