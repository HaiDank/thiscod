import type { SelectMessage } from "~/lib/db/schema";

export const useChatStore = defineStore("useChatStore", () => {
    const chatItems = ref<Map<number, SelectMessage[]>>(new Map());

    const chatLoading = ref(true);

    return {
        chatItems,
        chatLoading,
    };
});
