import type { User } from "better-auth";
import type { H3Event, H3EventContext } from "h3";

export type ChannelType = "TEXT" | "VOICE";
export type MemberRole = "ADMIN" | "GUEST";

export type UserWithId = Omit<User, "id"> & {
    id: number;
};
export type AuthenticatedEvent = H3Event & {
    context: H3EventContext & {
        user: UserWithId;
    };
};

declare module "socket.io" {
    // eslint-disable-next-line ts/consistent-type-definitions
    interface Socket {
        user?: UserWithId;
    }
}

declare module "h3" {
    // eslint-disable-next-line ts/consistent-type-definitions
    interface H3EventContext {
        user?: UserWithId;
    }
}
