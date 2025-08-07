import { findConversations } from "~/lib/db/queries/conversation";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    return await findConversations(event.context.user.id);
});
