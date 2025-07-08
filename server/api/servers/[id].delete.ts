import { z } from "zod";

import { removeServerById } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const id = getRouterParam(event, "id") as string;

    if (!z.coerce.number().safeParse(id).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid server id.",
        });
    }

    const deleted = await removeServerById(Number(id), event.context.user.id);

    if (!deleted) {
        throw createError({
            statusCode: 404,
            statusMessage: "Server not found.",
        });
    }

    setResponseStatus(event, 204);
});
