import { z } from "zod/v4";

import { findConversation } from "~/lib/db/queries/conversation";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const id = getRouterParam(event, "id") as string;

    if (!z.coerce.number().safeParse(id).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid id",
        });
    }

    const convo = await findConversation(Number(id), Number(event.context.user.id));

    if (!convo) {
        return createError({
            statusCode: 404,
            statusMessage: "Conversation not found",
        });
    }

    const otherUser = convo.userOneId === Number(event.context.user.id) ? convo.userTwo : convo.userOne;

    const conversation = {
        name: convo.name,
        id: convo.id,
        createdAt: convo.createdAt,
        updatedAt: convo.updatedAt,
        otherUser,
    };
    return conversation;
});
