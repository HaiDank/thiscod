import { z } from "zod/v4";

import { deleteMessage } from "~/lib/db/queries/message";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const id = getRouterParam(event, "message") as string;

    if (!z.coerce.number().safeParse(id).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid id.",
        });
    }

    const updated = await deleteMessage(Number(event.context.user.id), Number(id));

    return updated;
});
