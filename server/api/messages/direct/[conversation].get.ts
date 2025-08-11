import { z } from "zod/v4";

import { findConversation } from "~/lib/db/queries/conversation";
import { countDirectMessages, findDirectMessages } from "~/lib/db/queries/message";
import { PaginationRequest } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, PaginationRequest.safeParse);
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

    const directMessages = await findDirectMessages(Number(id), result.data.limit, result.data.cursor);
    const count = await countDirectMessages(Number(id));
    return { messages: directMessages, count: count[0]?.count };
});
