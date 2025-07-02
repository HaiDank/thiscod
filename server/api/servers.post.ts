import db from "~/lib/db";
import { InsertServer, server } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertServer.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const [created] = await db.insert(server).values({
        ...result.data,
        ownerId: event.context.user.id,
    }).returning();

    return created;
});
