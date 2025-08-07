import type { z } from "zod/v4";

import { relations, sql } from "drizzle-orm";
import { check, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import type { User } from "./auth";

import { user } from "./auth";
import { directMessage } from "./message";

export const conversation = sqliteTable("conversation", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text(),
    userOneId: int().notNull().references(() => user.id, { onDelete: "set null" }),
    userTwoId: int().notNull().references(() => user.id, { onDelete: "set null" }),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    unique().on(t.userOneId, t.userTwoId),
    check("conversation_user_id_order_check", sql`${t.userOneId} < ${t.userTwoId}`),
]);

// export const usersToConversations = sqliteTable("users_to_conversations", {
//     userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
//     conversationId: int().notNull().references(() => conversation.id, { onDelete: "cascade" }),

//     createdAt: int().notNull().$default(() => Date.now()),
//     updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
// }, t => [
//     primaryKey({ columns: [t.userId, t.conversationId] }),
// ]);

// export const usersToConversationsRelations = relations(usersToConversations, ({ one }) => ({
//     conversations: one(conversation, {
//         fields: [usersToConversations.conversationId],
//         references: [conversation.id],
//     }),
//     user: one(user, {
//         fields: [usersToConversations.userId],
//         references: [user.id],
//     }),
// }));

export const conversationRelations = relations(conversation, ({ many, one }) => ({
    directMessages: many(directMessage),
    userOne: one(user, {
        fields: [conversation.userOneId],
        references: [user.id],
    }),
    userTwo: one(user, {
        fields: [conversation.userTwoId],
        references: [user.id],
    }),
}));

export const InsertConversation = createInsertSchema(conversation, {
}).omit({
    id: true,
    name: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertConversation = z.infer<typeof InsertConversation>;
export type SelectConversation = typeof conversation.$inferSelect;
export type SelectConversationWithUsers = SelectConversation & {
    UserOne: User;
    UserTwo: User;
};
