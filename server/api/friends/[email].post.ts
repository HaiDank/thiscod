import z from "zod/v4";

import type { InsertFriendship } from "~/lib/db/schema";

import { sendFriendship } from "~/lib/db/queries/relationship";
import { findOneUserByEmail } from "~/lib/db/queries/user";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const email = getRouterParam(event, "email") as string;

    if (!z.email().safeParse(email).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid email query.",
        });
    }

    const user = await findOneUserByEmail(email);

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: "User not found.",
        });
    }

    const userOneId = Math.min(event.context.user.id, user.id);
    const userTwoId = Math.max(event.context.user.id, user.id);

    const insertData: InsertFriendship = {
        userOneId,
        userTwoId,
        actionUserId: event.context.user.id,
    };

    const res = await sendFriendship(insertData);

    return res;
});
