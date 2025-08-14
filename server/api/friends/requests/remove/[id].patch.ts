import { z } from "zod/v4";

import { findFriendshipWithUser, updateFriendship } from "~/lib/db/queries/relationship";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = getRouterParam(event, "id") as string;

    if (!z.coerce.number().safeParse(userId).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid request id.",
        });
    }

    const userOneId = Math.min(Number(event.context.user.id), Number(userId));
    const userTwoId = Math.max(Number(event.context.user.id), Number(userId));

    const friendRequest = await findFriendshipWithUser(userOneId, userTwoId);

    if (!friendRequest) {
        return createError({
            statusCode: 404,
            statusMessage: "Friend request not found.",
        });
    }

    const res = await updateFriendship(friendRequest.id, "REJECTED");

    return res;
});
