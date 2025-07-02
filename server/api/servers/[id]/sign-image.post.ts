import { z } from "zod";

import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

const MAX_CONTENT_LENGTH = 1024 * 1024 * 4;

const ImageSchema = z.object({
    contentLength: z.number().min(1).max(MAX_CONTENT_LENGTH),
    checksum: z.string(),
});

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, ImageSchema.safeParse);

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

    const id = getRouterParam(event, "id") as string;

    await $fetch(`/api/servers/${id}`);
});
