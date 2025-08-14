import z from "zod";

import { findMutualFriends } from "~/lib/db/queries/relationship";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = getRouterParam(event, "id");

    if (!z.coerce.number().safeParse(userId).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid param",
        });
    }

    const mutualFriends = await findMutualFriends(Number(event.context.user.id), Number(userId));

    return mutualFriends;
});
