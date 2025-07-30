import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import type { UserWithId } from "~/lib/types";

import { user } from "./auth";
import { channel } from "./channel";
import { conversation } from "./conversation";

export const message = sqliteTable("message", {
    id: int().primaryKey({ autoIncrement: true }),

    channelId: int().notNull().references(() => channel.id, { onDelete: "cascade" }),

    content: text(),
    file: text(),

    edited: int({ mode: "boolean" }).default(false),
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
    file: text(),

    conversationId: int().notNull().references(() => channel.id, { onDelete: "cascade" }),
    edited: int({ mode: "boolean" }).default(false),
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

export const InsertMessage = createInsertSchema(message, {
    content: field => field.min(1).max(250).optional(),
    file: field => field.regex(/^\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid key").optional(),
}).omit({
    id: true,
    edited: true,
    userId: true,
    channelId: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertMessage = z.infer<typeof InsertMessage>;
export type SelectMessage = typeof message.$inferSelect;
export type SelectMessageWithUser = SelectMessage & { user: UserWithId };
export type SelectDirectMessage = typeof directMessage.$inferSelect;

export const PaginationRequest = z.object({
    limit: z.coerce.number(),
    cursor: z.coerce.number().optional(),
});

export type PaginationRequest = z.output<typeof PaginationRequest>;
