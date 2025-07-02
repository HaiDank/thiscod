import type { z } from "zod/v4";

import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { user } from "./auth";
import { channel } from "./channel";

export const server = sqliteTable("server", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    inviteCode: text(),
    image: text(),
    ownerId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    index("server_owner_idx").on(t.ownerId),
]);

export const serverRelations = relations(server, ({ many }) => ({
    channels: many(channel),
}));

export const SelectServerWithChannels = createSelectSchema(server, {

});

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
