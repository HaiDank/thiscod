import type { AuthenticatedEvent } from "~/lib/types";

export default function defineAuthenticatedEventHandler<T>(
    handler: (event: AuthenticatedEvent) => T,
) {
    return defineEventHandler(async (event) => {
        if (!event.context.user) {
            throw createError({
                statusCode: 401,
                statusMessage: "Unauthorized",
            });
        }

        return handler(event as AuthenticatedEvent);
    });
}
