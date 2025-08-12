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
    return await db.query.directMessage.findMany({
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

export async function updateDirectMessage(userId: number, messageId: number, data: InsertDirectMessage) {
    const [updated] = await db.update(directMessage).set({ content: data.content, edited: true, updatedAt: Date.now() }).where(and(eq(directMessage.id, messageId), eq(directMessage.userId, userId))).returning();
    return updated;
}

export async function updateMessage(userId: number, messageId: number, data: InsertMessage) {
    const [updated] = await db.update(message).set({ content: data.content, edited: true, updatedAt: Date.now() }).where(and(eq(message.id, messageId), eq(message.userId, userId))).returning();
    return updated;
}

export async function deleteMessage(userId: number, messageId: number) {
    const [deleted] = await db.delete(message).where(and(eq(message.id, messageId), eq(message.userId, userId))).returning();
    return deleted;
}

export async function deleteDirectMessage(userId: number, directMessageId: number) {
    const [deleted] = await db.delete(directMessage).where(and(eq(directMessage.id, directMessageId), eq(directMessage.userId, userId))).returning();
    return deleted;
}
