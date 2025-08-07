import { and, eq, or } from "drizzle-orm";

import type { InsertConversation } from "../schema";

import db from "..";
import { conversation } from "../schema";

export async function findConversation(conversationId: number) {
    return await db.query.conversation.findFirst({
        where: eq(conversation.id, conversationId),
        with: {
            userOne: true,
            userTwo: true,
        },
    });
}

export async function findConversationWithUserIds(userOneId: number, userTwoId: number) {
    return await db.query.conversation.findFirst({
        where: and(eq(conversation.userOneId, userOneId), eq(conversation.userTwoId, userTwoId)),
        with: {
            userOne: true,
            userTwo: true,
        },
    });
}

export async function findConversations(userId: number) {
    return await db.query.conversation.findMany({
        where: or(eq(conversation.userOneId, userId), eq(conversation.userTwoId, userId)),
        with: {
            userOne: true,
            userTwo: true,
            directMessages: {
                limit: 1,
                orderBy: (directMessage, { desc }) => [desc(directMessage.createdAt)],
            },
        },
    });
}

export async function createConversation(insertable: InsertConversation) {
    const [created] = await db.insert(conversation).values({ ...insertable }).onConflictDoNothing(
        { target: [conversation.userOneId, conversation.userTwoId] },
    ).returning();

    return created;
}
