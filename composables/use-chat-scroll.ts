import { onWatcherCleanup } from "vue";

export function useChatScroll(messageContainerRef: Ref<HTMLElement | null>, fetchNext: () => void, shouldFetchNext: boolean) {
    const scrollToBottom = () => {
        if (!messageContainerRef.value)
            return;

        messageContainerRef.value.scrollTo({
            top: messageContainerRef.value.scrollHeight,
            behavior: "smooth",
        });
    };

    watchEffect(() => {
        const topDiv = messageContainerRef?.value;

        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop === 0 && shouldFetchNext) {
                fetchNext();
            }
        };

        topDiv?.addEventListener("scroll", handleScroll);

        onWatcherCleanup(() => {
            return () => topDiv?.removeEventListener("scroll", handleScroll);
        });
    });

    return {
        scrollToBottom,
    };
}
