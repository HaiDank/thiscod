import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, oneTimeToken } from "better-auth/plugins";

import db from "./db/index";
import env from "./env";

export const auth = betterAuth({
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/get-session") {
                if (!ctx.context.session) {
                    return ctx.json({
                        session: null,
                        user: null,
                    });
                }
                return ctx.json(ctx.context.session);
            }
        }),
    },
    plugins: [
        oneTimeToken({
            expiresIn: 3,
        }),
    ],
    database: drizzleAdapter(db, {
        provider: "sqlite",
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
