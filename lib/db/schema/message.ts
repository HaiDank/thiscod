import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { channel } from "./channel";
import { conversation } from "./conversation";

export const message = sqliteTable("message", {
    id: int().primaryKey({ autoIncrement: true }),

    channelId: int().notNull().references(() => channel.id, { onDelete: "cascade" }),

    content: text(),
    fileUrl: text(),

    edited: int({ mode: "boolean" }).default(false),
    seen: int({ mode: "boolean" }).default(false),
    userId: int().references(() => user.id, { onDelete: "set null" }),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const messageRelations = relations(message, ({ one }) => ({
    channel: one(channel, {
        fields: [message.channelId],
        references: [channel.id],
    }),
    user: one(user, {
        fields: [message.userId],
        references: [user.id],
    }),
}));

export const directMessage = sqliteTable("directMessage", {
    id: int().primaryKey({ autoIncrement: true }),
    content: text(),
    fileUrl: text(),

    conversationId: int().notNull().references(() => channel.id, { onDelete: "cascade" }),
    edited: int({ mode: "boolean" }).default(false),
    seen: int({ mode: "boolean" }).default(false),
    userId: int().references(() => user.id, { onDelete: "set null" }),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const directMessageRelations = relations(directMessage, ({ one }) => ({
    conversation: one(conversation, {
        fields: [directMessage.conversationId],
        references: [conversation.id],
    }),
    user: one(user, {
        fields: [directMessage.userId],
        references: [user.id],
    }),
}));
