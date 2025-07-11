import { and, eq } from "drizzle-orm";

import type { InsertChannel } from "../schema";

import db from "..";
import { channel } from "../schema";

export async function removeChannel(id: number, serverId: number) {
    const [removed] = await db.delete(channel).where(and(
        eq(channel.id, id),
        eq(channel.serverId, serverId),
    )).returning();

    return removed;
}

export async function insertChannel(insertable: InsertChannel) {
    const [created] = await db.insert(channel).values(insertable).returning();

    return created;
}

export async function findChannel(id: number) {
    return await db.query.channel.findFirst({
        where: eq(channel.id, id),
    });
}
