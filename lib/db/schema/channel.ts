import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { server } from "./servers";

type ChannelType = "TEXT" | "VOICE";

export const channel = sqliteTable("channel", {
    id: int().primaryKey({ autoIncrement: true }),
    channelType: text().$type<ChannelType>().default("TEXT"),
    name: text().notNull(),

    userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    serverId: int().notNull().references(() => server.id, { onDelete: "cascade" }),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
