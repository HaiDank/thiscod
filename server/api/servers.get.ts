import { findServers } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    return findServers(event.context.user.id);
});
