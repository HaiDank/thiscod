import { asc, eq } from "drizzle-orm";

import type { InsertMessage } from "../schema";

import db from "..";
import { message } from "../schema";

export async function insertMessage(insertable: InsertMessage, userId: number, channelId: number) {
    const [created] = await db.insert(message).values({ ...insertable, userId, channelId }).returning();

    return created;
}

export async function findMessages(channelId: number) {
    return await db.query.message.findMany({
        where: eq(message.channelId, channelId),
        with: {
            user: true,
        },
        orderBy: [asc(message.createdAt)],
        limit: 25,
    });
}
