import type { z } from "zod/v4";

import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import type { SelectChannel } from "./channel";

import { user } from "./auth";
import { channel } from "./channel";
import { member } from "./member";

export const server = sqliteTable("server", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    inviteCode: text().unique(),
    inviteCodeExpiresAt: int(),
    image: text(),
    ownerId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    index("server_owner_idx").on(t.ownerId),
]);

export const serverRelations = relations(server, ({ many }) => ({
    channels: many(channel),
    members: many(member),
}));

export const InsertServer = createInsertSchema(server, {
    name: field => field.min(1).max(100),
    image: field => field.regex(/^\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key").optional(),
}).omit({
    id: true,
    inviteCode: true,
    inviteCodeExpiresAt: true,
    ownerId: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertServer = z.infer<typeof InsertServer>;
export type SelectServer = typeof server.$inferSelect;
export type SelectServerWithChannels = SelectServer & {
    channels: SelectChannel[];
};
