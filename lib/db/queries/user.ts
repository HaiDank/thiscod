import { eq } from "drizzle-orm";

import db from "..";
import { user } from "../schema";

export async function findOneUser(id: number) {
    return await db.query.user.findFirst({
        where: eq(user.id, id),
    });
}

export async function findOneUserByEmail(email: string) {
    return await db.query.user.findFirst({
        where: eq(user.email, email),
    });
}

export async function updateUserStatus(id: number, status: "Online" | "Offline") {
    return await db.update(user).set({ lastSeenAt: Date.now(), status }).where(eq(user.id, id)).returning();
}

export async function updateUserLastSeen(id: number) {
    return await db.update(user).set({ lastSeenAt: Date.now(), status: "Online" }).where(eq(user.id, id)).returning();
}
