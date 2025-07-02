import { eq } from "drizzle-orm";

import db from "..";
import { server } from "../schema";

export async function findServers(userId: number) {
    return db.query.server.findMany({
        where: eq(server.ownerId, userId),
    });
}
