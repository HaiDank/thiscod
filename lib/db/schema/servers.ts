import type { z } from "zod/v4";

import { index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";

export const server = sqliteTable("server", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    inviteCode: text().notNull(),
    image: text(),
    ownerId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    unique().on(t.id, t.ownerId),
    index("owner_idx").on(t.ownerId),
]);

export const InsertServer = createInsertSchema(server, {
    name: field => field.min(1).max(100),
}).omit({
    id: true,
    inviteCode: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertServer = z.infer<typeof InsertServer>;
