import type { UserWithId } from "~/lib/types";

import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });
    event.context.user = session?.user as unknown as UserWithId;
    if (event.path.startsWith("/channels")) {
        if (!session?.user) {
            await sendRedirect(event, "/sign-in", 302);
        }
    }
});
