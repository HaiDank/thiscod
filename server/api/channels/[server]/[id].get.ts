import { z } from "zod";

import { findChannel } from "~/lib/db/queries/channel";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const channelId = getRouterParam(event, "id") as string;
    const serverId = getRouterParam(event, "server") as string;

    if (!z.coerce.number().safeParse(channelId).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid channel id.",
        });
    }

    if (!z.coerce.number().safeParse(serverId).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid server id.",
        });
    }

    const channel = await findChannel(Number(channelId), Number(serverId));

    if (!channel) {
        throw createError({
            statusCode: 404,
            statusMessage: "Channel not found.",
        });
    }

    return channel;
});
