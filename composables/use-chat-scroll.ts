import { useIntersectionObserver } from "@vueuse/core";

export function useChatScroll(messageContainerRef: Ref<HTMLElement | null>, firstMessageRef: Ref<HTMLElement | null>, fetchNext: () => void) {
    const scrollToBottom = () => {
        if (!messageContainerRef.value)
            return;

        messageContainerRef.value.scrollTo({
            top: messageContainerRef.value.scrollHeight,
            behavior: "smooth",
        });
    };

    useIntersectionObserver(
        firstMessageRef,
        ([entry]) => {
            if (entry?.isIntersecting) {
                fetchNext();
            }
        },
    );

    // watchEffect(() => {
    //     const topDiv = messageContainerRef?.value;

    //     const handleScroll = () => {
    //         const scrollTop = topDiv?.scrollTop;

    //         if (scrollTop === 0 && shouldFetchNext) {
    //             fetchNext();
    //             console.log("fetching Next");
    //         }
    //     };

    //     topDiv?.addEventListener("scroll", handleScroll);

    //     onWatcherCleanup(() => {
    //         return () => topDiv?.removeEventListener("scroll", handleScroll);
    //     });
    // });

    return {
        scrollToBottom,
    };
}
