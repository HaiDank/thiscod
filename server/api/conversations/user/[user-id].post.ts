import { z } from "zod/v4";

import { createConversation } from "~/lib/db/queries/conversation";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const id = getRouterParam(event, "user-id") as string;

    if (!z.coerce.number().safeParse(id).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid user Id",
        });
    }

    const userOneId = Math.min(Number(event.context.user.id), Number(id));
    const userTwoId = Math.max(Number(event.context.user.id), Number(id));

    return await createConversation({ userOneId, userTwoId });
});
