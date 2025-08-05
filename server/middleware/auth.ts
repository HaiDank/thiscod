import type { User } from "~/lib/db/schema";

import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });
    event.context.user = session?.user as unknown as User;
    if (event.path.startsWith("/channels") || event.path.startsWith("/app")) {
        if (!session?.user) {
            await sendRedirect(event, "/sign-in", 302);
        }
    }
});
