import type { User } from "better-auth";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "./db/index";
import env from "./env";

export type UserWithId = Omit<User, "id"> & {
    id: number;
};

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite", // or "pg" or "mysql"
    }),
    advanced: {
        database: {
            generateId: false,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: env.AUTH_GITHUB_CLIENT_ID as string,
            clientSecret: env.AUTH_GITHUB_CLIENT_SECRET as string,
        },
    },
});
