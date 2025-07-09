import type { InsertMember } from "../schema";

import db from "..";
import { member } from "../schema";

export async function insertMember(insertable: InsertMember) {
    const [created] = await db.insert(member).values(insertable).returning();

    return created;
}
