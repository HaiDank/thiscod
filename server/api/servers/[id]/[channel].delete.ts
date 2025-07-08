import { z } from "zod";

import { removeChannel } from "~/lib/db/queries/channel";
import { findServerWithChannels } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const serverId = getRouterParam(event, "id") as string;
    const channelId = getRouterParam(event, "channel") as string;

    if (!z.coerce.number().safeParse(serverId).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid server id.",
        });
    }

    if (!z.coerce.number().safeParse(channelId).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid channel id.",
        });
    }

    const server = await findServerWithChannels(Number(serverId));

    if (!server) {
        throw createError({
            statusCode: 404,
            statusMessage: "Server not found.",
        });
    }

    if (server.ownerId !== Number(event.context.user.id)) {
        throw createError({
            statusCode: 401,
            statusMessage: "Unauthorized asdasd.",
        });
    }

    const deleted = await removeChannel(Number(channelId), Number(serverId));

    if (!deleted) {
        throw createError({
            statusCode: 404,
            statusMessage: "Channel not found.",
        });
    }

    setResponseStatus(event, 204);
});
