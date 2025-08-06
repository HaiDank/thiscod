import { findFriendships } from "~/lib/db/queries/relationship";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    return await findFriendships(event.context.user.id, "ACCEPTED");
});
