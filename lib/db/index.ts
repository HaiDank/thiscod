import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";
import env from "~/lib/env";

// You can specify any property from the libsql connection options
const db = drizzle({
	connection: {
		url: env.TURSO_DATABASE_URL!,
		authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN!,
	},
	schema,
});

export default db;
