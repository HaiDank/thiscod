import { insertChannel } from "~/lib/db/queries/channel";
import { InsertChannel } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertChannel.safeParse);
    if (!result.success) {
        return sendZodError(event, result.error);
    }

    return insertChannel(result.data);
});
