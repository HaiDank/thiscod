import { findConversation } from "~/lib/db/queries/conversation";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    return await findConversation(event.context.user.id);
});
