import { and, eq, ne, not, or, sql } from "drizzle-orm";

import type { FriendshipStatus, InsertFriendship } from "../schema";

import db from "..";
import { friendship, user } from "../schema";

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

export async function deleteFriendship(requestId: number) {
    return await db.delete(friendship).where(eq(friendship.id, requestId)).returning();
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

export async function findFriendship(requestId: number, userId: number, status: "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED") {
    return await db.query.friendship.findFirst({
        where: and(or(eq(friendship.userOneId, userId), eq(friendship.userTwoId, userId)), eq(friendship.status, status), eq(friendship.id, requestId)),
        with: {
            userOne: true,
            userTwo: true,
        },
    });
}

export async function findFriendshipWithUser(userOneId: number, userTwoId: number) {
    return await db.query.friendship.findFirst({
        where: and(eq(friendship.userOneId, userOneId), eq(friendship.userTwoId, userTwoId)),
        with: {
            userOne: true,
            userTwo: true,
        },
    });
}

export async function findMutualFriends(userAId: number, userBId: number) {
    const friendsOfA = db
        .select({
            friendAId: sql<number>`CASE 
        WHEN ${friendship.userOneId} = ${userAId} THEN ${friendship.userTwoId}
        ELSE ${friendship.userOneId}
      END`.as("friend_A_id"),
        })
        .from(friendship)
        .where(and(
            eq(friendship.status, "ACCEPTED"),
            or(
                eq(friendship.userOneId, userAId),
                eq(friendship.userTwoId, userAId),
            ),
        ))
        .as("friends_of_a");

    // Get all friends of user B
    const friendsOfB = db
        .select({
            friendBId: sql<number>`CASE 
        WHEN ${friendship.userOneId} = ${userBId} THEN ${friendship.userTwoId}
        ELSE ${friendship.userOneId}
      END`.as("friend_B_id"),
        })
        .from(friendship)
        .where(and(
            eq(friendship.status, "ACCEPTED"),
            or(
                eq(friendship.userOneId, userBId),
                eq(friendship.userTwoId, userBId),
            ),
        ))
        .as("friends_of_b");

    // Find intersection of both friend lists
    const mutualFriends = await db
        .select({
            id: user.id,
            name: user.name,
            image: user.image,
        })
        .from(user)
        .innerJoin(friendsOfA, eq(user.id, friendsOfA.friendAId))
        .innerJoin(friendsOfB, eq(user.id, friendsOfB.friendBId))
        .where(and(
            ne(user.id, userAId),
            ne(user.id, userBId),
        ));

    return mutualFriends;
}
