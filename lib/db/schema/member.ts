import type { z } from "zod/v4";

import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import { server } from "./servers";

export const member = sqliteTable("member", {
    id: int().primaryKey({ autoIncrement: true }),
    memberRole: text({ mode: "text", enum: ["GUEST", "ADMIN"] }).notNull().default("GUEST"),

    userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    serverId: int().notNull().references(() => server.id, { onDelete: "cascade" }),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    unique().on(t.serverId, t.userId),
    index("member_user_idx").on(t.userId),
    index("member_server_idx").on(t.serverId),
]);

export const memberRelations = relations(member, ({ one }) => ({
    server: one(server, {
        fields: [member.serverId],
        references: [server.id],
    }),
    user: one(user, {
        fields: [member.userId],
        references: [user.id],
    }),
}));

export const InsertMember = createInsertSchema(member, {
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertMember = z.infer<typeof InsertMember>;
export type SelectMember = typeof member.$inferSelect;
