import { and, desc, eq, lt } from "drizzle-orm";

import type { InsertMessage } from "../schema";

import db from "..";
import { message } from "../schema";

export async function insertMessage(insertable: InsertMessage, userId: number, channelId: number) {
    const [created] = await db.insert(message).values({ ...insertable, userId, channelId }).returning();

    return created;
}

export async function findMessages(channelId: number, limit: number, cursor?: number) {
    return await db.query.message.findMany({
        where: and(eq(message.channelId, channelId), cursor ? lt(message.createdAt, cursor) : undefined),
        with: {
            user: true,
        },
        orderBy: [desc(message.createdAt)],
        limit,
    });
}
