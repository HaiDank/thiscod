import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

export const server = sqliteTable("server", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    inviteCode: text().notNull(),
    image: text(),
    ownerId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
