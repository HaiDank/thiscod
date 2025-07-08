import { insertServer } from "~/lib/db/queries/server";
import { InsertServer } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertServer.safeParse);
    if (!result.success) {
        return sendZodError(event, result.error);
    }

    return insertServer(result.data, event.context.user.id);
});
