import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// import { usersToConversations } from "./conversation";

export const user = sqliteTable("user", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: integer({ mode: "boolean" }).$defaultFn(() => false).notNull(),
    image: text(),
    lastSeenAt: integer().$defaultFn(() => Date.now()).notNull(),
    status: text({ mode: "text", enum: ["Online", "Offline", "Invisible"] }).default("Offline").notNull(),
    createdAt: integer().$defaultFn(() => Date.now()).notNull(),
    updatedAt: integer().$defaultFn(() => Date.now()).notNull(),
});

// export const userRelations = relations(user, ({ many }) => ({
//     usersToConversations: many(usersToConversations),
// }));

export type User = typeof user.$inferSelect;

export const session = sqliteTable("session", {
    id: int().primaryKey({ autoIncrement: true }),
    expiresAt: integer().notNull(),
    token: text().notNull().unique(),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
    id: int().primaryKey({ autoIncrement: true }),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: integer(),
    refreshTokenExpiresAt: integer(),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer().notNull(),
    updatedAt: integer().notNull(),
});

export const verification = sqliteTable("verification", {
    id: int().primaryKey({ autoIncrement: true }),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: integer().notNull(),
    createdAt: integer().$default(() => Date.now()),
    updatedAt: integer().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
