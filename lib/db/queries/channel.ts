import { and, eq } from "drizzle-orm";

import db from "..";
import { channel } from "../schema";

export async function removeChannel(id: number, serverId: number) {
    const [removed] = await db.delete(channel).where(and(
        eq(channel.id, id),
        eq(channel.serverId, serverId),
    )).returning();

    return removed;
}
