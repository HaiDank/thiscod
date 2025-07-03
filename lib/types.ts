import type { H3Event, H3EventContext } from "h3";

import type { UserWithId } from "./auth";

export type AuthenticatedEvent = H3Event & {
    context: H3EventContext & {
        user: UserWithId;
    };
};

declare module "h3" {
    // eslint-disable-next-line ts/consistent-type-definitions
    interface H3EventContext {
        user?: UserWithId;
    }
}
