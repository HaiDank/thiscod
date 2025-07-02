import { relations } from "drizzle-orm";
import { index, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

import { message } from "./message";
import { server } from "./servers";

type ChannelType = "TEXT" | "VOICE";

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

export type SelectChannel = typeof channel.$inferSelect;
