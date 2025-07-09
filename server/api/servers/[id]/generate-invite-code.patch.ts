import { customAlphabet } from "nanoid";

import { patchNewInviteCode } from "~/lib/db/queries/server";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import { isNumber } from "~/utils/utils";

export default defineAuthenticatedEventHandler(async (event) => {
    const serverId = getRouterParam(event, "id") as string;

    isNumber(serverId);
    const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");

    const inviteCodeExpiresAt = Date.now() + 1000 * 60 * 60 * 24; // 1 day
    const inviteCode = nanoid();
    const [code] = await patchNewInviteCode(Number(serverId), inviteCode, inviteCodeExpiresAt);
    return code.code;
});
