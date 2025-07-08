import { and, eq } from "drizzle-orm";

import type { InsertServer } from "../schema";

import db from "..";
import { server } from "../schema";

export async function findServers(userId: number) {
    return db.query.server.findMany({
        where: eq(server.ownerId, userId),
    });
}

export async function findServerWithChannels(id: number) {
    return db.query.server.findFirst({
        where: eq(server.id, id),
        with: {
            channels: true,
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
