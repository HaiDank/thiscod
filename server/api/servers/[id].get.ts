import { z } from "zod";

import { findServerWithChannels } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const serverId = getRouterParam(event, "id") as string;

    if (!z.coerce.number().safeParse(serverId).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid server id.",
        });
    }

    const server = await findServerWithChannels(Number(serverId));

    if (!server) {
        throw createError({
            statusCode: 404,
            statusMessage: "server not found.",
        });
    }

    return server;
});
