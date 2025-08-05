import { z } from "zod/v4";

import { deleteFriendship, findFriendship } from "~/lib/db/queries/relationship";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const requestId = getRouterParam(event, "id");

    if (!z.coerce.number().safeParse(requestId).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid request id.",
        });
    }

    const friendRequest = await findFriendship(Number(requestId), event.context.user.id, "PENDING");

    if (!friendRequest) {
        return createError({
            statusCode: 404,
            statusMessage: "Friend request not found.",
        });
    }

    if (friendRequest.actionUserId !== Number(event.context.user.id)) {
        return createError({
            statusCode: 403,
            statusMessage: "Cannot perform action on this friend request.",
        });
    }

    const res = await deleteFriendship(Number(requestId));

    return res;
});
