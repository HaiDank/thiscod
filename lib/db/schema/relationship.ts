import type { z } from "zod/v4";

import { relations, sql } from "drizzle-orm";
import { check, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";

export const friendship = sqliteTable("friendship", {
    id: int().primaryKey({ autoIncrement: true }),
    userOneId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    userTwoId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    status: text({ mode: "text", enum: ["PENDING", "ACCEPTED", "REJECTED", "BLOCKED"] }).default("PENDING").notNull(),
    actionUserId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    unique().on(t.userOneId, t.userTwoId),
    check("friendship_user_id_order_check", sql`${t.userOneId} < ${t.userTwoId}`),
]);

export const friendshipRelations = relations(friendship, ({ one }) => ({
    userOne: one(user, {
        fields: [friendship.userOneId],
        references: [user.id],
    }),
    userTwo: one(user, {
        fields: [friendship.userTwoId],
        references: [user.id],
    }),
}));

export const InsertFriendship = createInsertSchema(friendship, {
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    status: true,
});
export type FriendshipStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "BLOCKED";
export type InsertFriendship = z.infer<typeof InsertFriendship>;
export type SelectFriendship = typeof friendship.$inferSelect;
