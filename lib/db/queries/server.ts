import { and, eq, gt } from "drizzle-orm";

import type { InsertServer } from "../schema";

import db from "..";
import { member, server } from "../schema";

export async function findServers(userId: number) {
    return db.select()
        .from(server)
        .leftJoin(member, eq(server.id, member.serverId))
        .where(eq(member.userId, userId));
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
    return await db.update(server).set({ inviteCode, inviteCodeExpiresAt }).where(eq(server.id, serverId)).returning({ code: server.inviteCode });
}
