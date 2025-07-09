export function useOrigin() {
    if (import.meta.server) {
        const event = useRequestEvent();

        if (!event)
            return null;

        return `${getRequestProtocol(event)}://${getRequestHost(event)}`;
    }

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

    return origin;
}
