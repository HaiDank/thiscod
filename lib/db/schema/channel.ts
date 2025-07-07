import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import type { ChannelType } from "~/lib/types";

import { message } from "./message";
import { server } from "./servers";

export const channel = sqliteTable("channel", {
    id: int().primaryKey({ autoIncrement: true }),
    channelType: text().$type<ChannelType>().default("TEXT"),
    name: text().notNull(),

    serverId: int().notNull().references(() => server.id, { onDelete: "cascade" }),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, t => [
    unique().on(t.serverId, t.name),
    index("channel_server_idx").on(t.serverId),
]);

export const channelRelations = relations(channel, ({ one, many }) => ({
    server: one(server, {
        fields: [channel.serverId],
        references: [server.id],
    }),
    messages: many(message),
}));

export const InsertChannel = createInsertSchema(channel, {
    name: field => field.min(1).max(100),
}).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export type SelectChannel = typeof channel.$inferSelect;
