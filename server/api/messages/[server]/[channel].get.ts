import { z } from "zod";

import { findMessages } from "~/lib/db/queries/message";
import { findServerWithChannelsAndMembers } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const channelId = getRouterParam(event, "channel") as string;
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

    const server = await findServerWithChannelsAndMembers(Number(serverId));

    if (!server) {
        throw createError({
            statusCode: 404,
            statusMessage: "Server not found.",
        });
    }

    const channel = server.channels.find(channel => channel.id === Number(channelId));

    if (!channel) {
        throw createError({
            statusCode: 404,
            statusMessage: "Channel not found.",
        });
    }

    const user = server.members.find(user => user.userId === Number(event.context.user.id));
    if (!user) {
        throw createError({
            statusCode: 403,
            statusMessage: "No permission to server.",
        });
    }

    const messages = await findMessages(Number(channelId));

    return messages;
});
