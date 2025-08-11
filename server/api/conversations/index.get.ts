import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

import { findConversations } from "../../../lib/db/queries/conversation";

export default defineAuthenticatedEventHandler(async (event) => {
    return await findConversations(event.context.user.id);
});
