import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { z } from "zod/v4";

import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

const MAX_CONTENT_LENGTH = 1024 * 1024 * 4;

const ImageSchema = z.object({
    contentLength: z.number().min(1).max(MAX_CONTENT_LENGTH),
    checksum: z.string(),
});

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, ImageSchema.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const client = createS3Client();

    const fileName = crypto.randomUUID();
    const key = `${event.context.user.id}/${fileName}.jpg`;

    const { url, fields } = await createPresignedPost(client, {
        Bucket: env.S3_BUCKET,
        Key: key,
        Expires: 120,
        Fields: {
            "x-amz-checksum-sha256": result.data.checksum,
        },
        Conditions: [
            ["content-length-range", result.data.contentLength, result.data.contentLength],
            ["eq", "$x-amz-meta-user-id", event.context.user.id.toString()],
        ],
    });

    fields["x-amz-meta-user-id"] = event.context.user.id.toString();

    return { url, fields, key };
});
