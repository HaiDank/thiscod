import z from "zod";

import { findMutualServers } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = getRouterParam(event, "id");

    if (!z.coerce.number().safeParse(userId).success) {
        return createError({
            statusCode: 422,
            statusMessage: "Invalid param",
        });
    }

    const mutualServers = await findMutualServers(Number(event.context.user.id), Number(userId));

    return mutualServers;
});
