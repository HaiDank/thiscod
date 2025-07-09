import { findMember, insertMember } from "~/lib/db/queries/member";
import { findServerByInviteCode } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
    const inviteCode = getRouterParam(event, "code") as string;

    const server = await findServerByInviteCode(inviteCode);

    if (!server) {
        throw createError({
            statusCode: 404,
            statusMessage: "The invite code is invalid or has expired.",
        });
    }

    if (Number(event.context.user.id) === server.ownerId) {
        await sendRedirect(event, `/channels/${server.id}`, 200);
    }

    const member = await findMember(event.context.user.id, server.id);

    if (!member) {
        await insertMember({ serverId: server.id, userId: event.context.user.id });
    }
    await sendRedirect(event, `/channels/${server.id}`, 302);
});
