import db from "~/lib/db";
import { InsertServer, server } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
    if (!event.context.user) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
        }));
    }

    const result = await readValidatedBody(event, InsertServer.safeParse);

    if (!result.success) {
        const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join(";");
        const data = result.error.issues.reduce((errors, issue) => {
            errors[issue.path.join("")] = issue.message;
            return errors;
        }, {} as Record<string, string>);

        return sendError(event, createError({
            statusCode: 422,
            statusMessage,
            data,
        }));
    }

    const [created] = await db.insert(server).values({
        ...result.data,
        ownerId: event.context.user.id,
    }).returning();

    return created;
});
