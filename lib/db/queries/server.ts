import { and, eq, gt, inArray, sql } from "drizzle-orm";

import type { InsertServer } from "../schema";

import db from "..";
import { member, server } from "../schema";

export async function findServers(userId: number) {
    return db.select()
        .from(server)
        .leftJoin(member, eq(server.id, member.serverId))
        .where(eq(member.userId, userId));
}

export async function findOneServer(id: number) {
    return db.query.server.findFirst({
        where: eq(server.id, id),
    });
}

export async function findServerWithChannelsAndMembers(id: number) {
    return db.query.server.findFirst({
        where: eq(server.id, id),
        with: {
            channels: true,
            members: true,
        },
    });
}

export async function findServerByInviteCode(code: string) {
    const now = Date.now();
    return db.query.server.findFirst({
        where: and(eq(server.inviteCode, code), gt(server.inviteCodeExpiresAt, now)),
        with: {
            channels: true,
            members: true,
        },
    });
}

export async function insertServer(insertable: InsertServer, ownerId: number) {
    const [created] = await db.insert(server).values({
        ...insertable,
        ownerId,
    }).returning();

    return created;
}

export async function removeServerById(id: number, ownerId: number) {
    const [remove] = await db.delete(server).where(and(
        eq(server.id, id),
        eq(server.ownerId, ownerId),
    )).returning();

    return [remove];
}

export async function patchNewInviteCode(serverId: number, inviteCode: string, inviteCodeExpiresAt: number) {
    return await db.update(server).set({ inviteCode, inviteCodeExpiresAt }).where(eq(server.id, serverId)).returning({ code: server.inviteCode, expiresAt: server.inviteCodeExpiresAt });
}

export async function findMutualServers(userId: number, otherUserId: number) {
    const mutualServerIdsSubquery = db
        .select({ serverId: member.serverId })
        .from(member)
        .where(inArray(member.userId, [userId, otherUserId]))
        .groupBy(member.serverId)
        .having(sql`count(${member.serverId}) = 2`);

    const mutualServers = await db.query.server.findMany({
        where: (server, { inArray }) => inArray(server.id, mutualServerIdsSubquery),
        columns: {
            image: true,
            id: true,
            name: true,
        },
        with: {
            members: {
                with: {
                    user: true,
                },
            },
        },
    });
    return mutualServers;
}
