import { sql } from "drizzle-orm";
import { check, index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { channel } from "./channel";
import { conversation } from "./conversation";

export const message = sqliteTable("message", {
    id: int().primaryKey({ autoIncrement: true }),

    content: text(),
    fileUrl: text(),

    userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    channelId: int().notNull().references(() => channel.id, { onDelete: "cascade" }),

    deleted: int({ mode: "boolean" }).default(false),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    index("user_idx").on(t.userId),
    check(
        "content_or_file_not_null",
        sql`${t.content} IS NOT NULL OR ${t.fileUrl} IS NOT NULL`,
    ),
]);

export const directMessage = sqliteTable("directMessage", {
    id: int().primaryKey({ autoIncrement: true }),

    content: text(),
    fileUrl: text(),

    userId: int().references(() => user.id, { onDelete: "set null" }),
    conversationId: int().notNull().references(() => conversation.id, { onDelete: "cascade" }),

    deleted: int({ mode: "boolean" }).default(false),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    index("user_idx").on(t.userId),
    check(
        "content_or_file_not_null",
        sql`${t.content} IS NOT NULL OR ${t.fileUrl} IS NOT NULL`,
    ),
]);

export const groupMessage = sqliteTable("groupMessage", {
    id: int().primaryKey({ autoIncrement: true }),

    content: text(),
    fileUrl: text(),

    userId: int().references(() => user.id, { onDelete: "set null" }),
    groupId: int().notNull().references(() => conversation.id, { onDelete: "cascade" }),

    deleted: int({ mode: "boolean" }).default(false),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    index("user_idx").on(t.userId),
    check(
        "content_or_file_not_null",
        sql`${t.content} IS NOT NULL OR ${t.fileUrl} IS NOT NULL`,
    ),
]);
