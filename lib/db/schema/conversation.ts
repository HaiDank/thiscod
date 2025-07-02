import { int, sqliteTable } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

export const conversation = sqliteTable("conversation", {
    id: int().primaryKey({ autoIncrement: true }),

    userOneId: int().references(() => user.id, { onDelete: "set null" }),
    userTwoId: int().references(() => user.id, { onDelete: "set null" }),

    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
