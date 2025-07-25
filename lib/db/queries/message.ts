import type { InsertMessage } from "../schema";

import db from "..";
import { message } from "../schema";

export async function insertMessage(insertable: InsertMessage, userId: number, channelId: number) {
    const [created] = await db.insert(message).values({ ...insertable, userId, channelId }).returning();

    return created;
}
