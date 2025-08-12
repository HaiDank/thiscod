import { z } from "zod/v4";

import { updateDirectMessage } from "~/lib/db/queries/message";
import { InsertMessage } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertMessage.safeParse);
    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const id = getRouterParam(event, "conversation") as string;
    if (!z.coerce.number().safeParse(id).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid id.",
        });
    }

    const updated = await updateDirectMessage(Number(event.context.user.id), Number(id), result.data);
    console.log(updated);

    return updated;
});
