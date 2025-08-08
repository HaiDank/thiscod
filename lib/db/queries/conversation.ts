import { and, desc, eq, max, ne, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";

import type { InsertConversation } from "../schema";

import db from "..";
import { conversation, directMessage, user } from "../schema";

export async function findConversation(conversationId: number, userId: number) {
    return await db.query.conversation.findFirst({
        where: and(eq(conversation.id, conversationId), or(
            eq(conversation.userOneId, userId),
            eq(conversation.userTwoId, userId),
        )),
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
    const otherUser = alias(user, "other_user");

    const latestMessageSubquery = db
        .select({
            conversationId: directMessage.conversationId,
            // Use the 'max' aggregate function and alias the result as 'lastMessageAt'
            lastMessageAt: max(directMessage.createdAt).as("last_message_at"),
        })
        .from(directMessage)
        .groupBy(directMessage.conversationId)
        .as("latest_message");

    const result = await db
        .select({
            // Select the fields you want from the conversation table
            conversation,
            otherUserDetails: {
                id: otherUser.id,
                name: otherUser.name,
                image: otherUser.image,
                status: otherUser.status,
            },
            // And the timestamp from our subquery
            lastMessageAt: latestMessageSubquery.lastMessageAt,
        })
        .from(conversation)
    // Filter for the specific user
        .innerJoin(otherUser, or(
            // The other user is userOne...
            eq(conversation.userOneId, otherUser.id),
            // ...or the other user is userTwo
            eq(conversation.userTwoId, otherUser.id),
        ))
        // Join with latest message subquery
        .leftJoin(latestMessageSubquery, eq(conversation.id, latestMessageSubquery.conversationId),
        )
        .where(
            and(
                // 1. The conversation must involve our main user
                or(
                    eq(conversation.userOneId, userId),
                    eq(conversation.userTwoId, userId),
                ),
                // 2. The 'otherUser' we joined must NOT be our main user
                ne(otherUser.id, userId),
            ),
        )
    // Order by the timestamp from the subquery, descending
        .orderBy(desc(sql`COALESCE(${latestMessageSubquery.lastMessageAt}, ${conversation.createdAt})`));

    return result;
}

export async function createConversation(insertable: InsertConversation) {
    const [created] = await db.insert(conversation).values({ ...insertable }).onConflictDoNothing(
        { target: [conversation.userOneId, conversation.userTwoId] },
    ).returning();

    return created;
}
