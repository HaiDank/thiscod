import type { RouteLocationRaw } from "vue-router";

export type SidebarItem = {
    id: string;
    icon?: string;
    avatarUrl?: string;
    alt?: string;
    href?: string;
    to?: RouteLocationRaw;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
    const sidebarItems = ref<SidebarItem[]>([]);
    const sidebarChannelItems = ref<SidebarItem[]>([]);
    const sidebarConversationItems = ref<SidebarItem[]>([]);
    const loading = ref(false);

    return {
        loading,
        sidebarItems,
        sidebarConversationItems,
        sidebarChannelItems,
    };
});
