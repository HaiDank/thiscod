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

export function formatMessageTime(timestamp: number): string {
    // Handle both seconds and milliseconds
    const ms = timestamp.toString().length <= 10 ? timestamp * 1000 : timestamp;
    const date = new Date(ms);
    const now = new Date();

    // Today
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday at ${date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })}`;
    }

    // Within this week
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    // This year
    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    // Previous years
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
