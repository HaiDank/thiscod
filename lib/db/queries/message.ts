import { and, count, desc, eq, lt } from "drizzle-orm";

import type { InsertDirectMessage, InsertMessage } from "../schema";

import db from "..";
import { directMessage, message } from "../schema";

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

export async function countMessages(channelId: number) {
    return await db.select({ count: count(message.channelId) }).from(message).where(eq(message.channelId, channelId));
}

export async function insertDirectMessage(insertable: InsertDirectMessage, userId: number, conversationId: number) {
    const [created] = await db.insert(directMessage).values({ ...insertable, userId, conversationId }).returning();

    return created;
}

export async function findDirectMessages(conversationId: number, limit: number, cursor?: number) {
    return await db.query.message.findMany({
        where: and(eq(directMessage.conversationId, conversationId), cursor ? lt(directMessage.createdAt, cursor) : undefined),
        with: {
            user: true,
        },
        orderBy: [desc(directMessage.createdAt)],
        limit,
    });
}

export async function countDirectMessages(conversationId: number) {
    return await db.select({ count: count(directMessage.conversationId) }).from(directMessage).where(eq(directMessage.conversationId, conversationId));
}
