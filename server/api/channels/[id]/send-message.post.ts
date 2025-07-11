import { z } from "zod";

import { insertMessage } from "~/lib/db/queries/message";
import { InsertMessage } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

import { findChannel } from "../../../../lib/db/queries/channel";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertMessage.safeParse);
    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const channelId = getRouterParam(event, "id") as string;

    if (!z.coerce.number().safeParse(channelId).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid channel id.",
        });
    }

    const channel = await findChannel(Number(channelId));

    if (!channel) {
        throw createError({
            statusCode: 404,
            statusMessage: "Channel not found.",
        });
    }

    const createdMessage = await insertMessage(result.data, event.context.user.id, Number(channelId));

    return createdMessage;
});
