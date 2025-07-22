import { z } from "zod";

import { findMember } from "~/lib/db/queries/member";
import { findServerWithChannelsAndMembers } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const serverId = getRouterParam(event, "id") as string;

    if (!z.coerce.number().safeParse(serverId).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid server id.",
        });
    }

    const member = await findMember(event.context.user.id, Number(serverId));

    if (!member) {
        throw createError({
            statusCode: 403,
            statusMessage: "No permission.",
        });
    }

    const server = await findServerWithChannelsAndMembers(Number(serverId));

    if (!server) {
        throw createError({
            statusCode: 404,
            statusMessage: "Server not found.",
        });
    }

    return server;
});
