import { z } from "zod";

export function isNumber(param: string) {
    if (!z.coerce.number().safeParse(param).success) {
        throw createError({
            statusCode: 422,
            statusMessage: "Invalid parameter.",
        });
    }

    return true;
}

export function isInThePast(unix: number) {
    const now = Date.now();
    return unix - now <= 0;
}

export function getTimeUntilX(x: number) {
    if (isInThePast(x)) {
        return null;
    }
    const now = Date.now();
    const delta = x - now;
    const day = Math.floor(delta / (1000 * 60 * 60 * 24));
    if (day < 1) {
        const hour = Math.floor(delta / (1000 * 60 * 60));
        if (hour < 1) {
            return `under 1 hour`;
        }
        else if (hour === 1) {
            return `${hour} hour`;
        }
        else {
            return `${hour} hours`;
        }
    }
    else if (day === 1) {
        return `${day} day`;
    }
    else {
        return `${day} days`;
    }
}
