import { z } from "zod";
import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
	NODE_ENV: z.string(),
	NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	NUXT_CLERK_SECRET_KEY: z.string(),
	CLERK_SIGN_IN_URL: z.string(),
	CLERK_SIGN_UP_URL: z.string(),
	CLERK_SIGN_IN_FORCE_REDIRECT_URL: z.string(),
	CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string(),
	CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
	CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),
	TURSO_DATABASE_URL: z.string(),
	TURSO_AUTH_TOKEN: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

tryParseEnv(EnvSchema);

export default EnvSchema.parse(process.env);
