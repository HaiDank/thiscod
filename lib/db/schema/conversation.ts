import { relations } from "drizzle-orm";
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { directMessage } from "./message";

export const conversation = sqliteTable("conversation", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text(),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const usersToConversations = sqliteTable("users_to_conversations", {
    userId: int()
        .notNull()
        .references(() => user.id),
    conversationId: int()
        .notNull()
        .references(() => conversation.id),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    primaryKey({ columns: [t.userId, t.conversationId] }),
]);

export const conversationRelations = relations(conversation, ({ many }) => ({
    usersToConversations: many(usersToConversations),
    messages: many(directMessage),
}));
