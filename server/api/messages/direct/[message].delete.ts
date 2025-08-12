import { z } from "zod/v4";

import { deleteDirectMessage } from "~/lib/db/queries/message";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const id = getRouterParam(event, "conversation") as string;
    if (!z.coerce.number().safeParse(id).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid id.",
        });
    }

    const deleted = await deleteDirectMessage(Number(event.context.user.id), Number(id));
    if (!deleted) {
        throw createError({
            statusCode: 404,
            statusMessage: "Message not found.",
        });
    }
    return deleted;
});
