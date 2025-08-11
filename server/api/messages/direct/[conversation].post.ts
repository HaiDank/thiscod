import { z } from "zod";

import { findConversation } from "~/lib/db/queries/conversation";
import { insertDirectMessage } from "~/lib/db/queries/message";
import { InsertMessage } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertMessage.safeParse);
    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const id = getRouterParam(event, "conversation");

    if (!z.coerce.number().safeParse(id).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid id.",
        });
    }

    const conversation = await findConversation(Number(id), Number(event.context.user.id));

    if (!conversation) {
        return createError({
            statusCode: 404,
            statusMessage: "Conversation not found.",
        });
    }

    const createdDirectMessage = await insertDirectMessage(result.data, Number(event.context.user.id), Number(id));

    return createdDirectMessage;
});
