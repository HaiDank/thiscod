import { and, eq, not, or, sql } from "drizzle-orm";

import type { FriendshipStatus, InsertFriendship } from "../schema";

import db from "..";
import { friendship } from "../schema";

export async function sendFriendship(insertable: InsertFriendship) {
    const [created] = await db.insert(friendship).values({
        ...insertable,
    }).onConflictDoUpdate(
        { target: [friendship.userOneId, friendship.userTwoId], set: { status: "PENDING", updatedAt: sql`(strftime('%s', 'now'))`, actionUserId: insertable.actionUserId }, where:
          eq(friendship.status, "REJECTED") },
    ).returning();

    return created;
}

export async function blockFriendship(insertable: InsertFriendship) {
    const [created] = await db.insert(friendship).values({
        ...insertable,
        status: "BLOCKED",
    }).onConflictDoUpdate(
        { target: [friendship.userOneId, friendship.userTwoId], set: { status: "BLOCKED", updatedAt: sql`(strftime('%s', 'now'))`, actionUserId: insertable.actionUserId }, where:
          not(eq(friendship.status, "BLOCKED")) },
    ).returning();

    return created;
}

export async function updateFriendship(requestId: number, status: FriendshipStatus) {
    return await db.update(friendship).set({ status }).where(eq(friendship.id, requestId)).returning();
}

export async function findFriendships(userId: number, status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED") {
    return await db.query.friendship.findMany({
        where: and(or(eq(friendship.userOneId, userId), eq(friendship.userTwoId, userId)), eq(friendship.status, status)),
        with: {
            userOne: true,
            userTwo: true,
        },
    });
}
