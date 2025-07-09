import { and, eq } from "drizzle-orm";

import type { InsertMember } from "../schema";

import db from "..";
import { member } from "../schema";

export async function insertMember(insertable: InsertMember) {
    const [created] = await db.insert(member).values(insertable).returning();

    return created;
}

export async function findMember(userId: number, serverId: number) {
    return await db.query.member.findFirst({
        where: and(
            eq(member.userId, userId),
            eq(member.serverId, serverId),
        ),
    });
}
