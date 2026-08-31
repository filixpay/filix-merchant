import type { TaskPriority } from "@/lib/api/domains/notifications/shared/contracts";

const HOUR_MS = 60 * 60 * 1000;
const HOURS_72 = 72 * HOUR_MS;
const DAYS_7 = 7 * 24 * HOUR_MS;

/** Aligns with filix-pay TaskPriorityResolver (hour granularity). */
export function computeTaskPriority(dueAt?: string, now = new Date()): TaskPriority {
    if (!dueAt) {
        return "LOW";
    }

    const due = new Date(dueAt).getTime();
    if (Number.isNaN(due)) {
        return "LOW";
    }

    const nowMs = now.getTime();
    if (due <= nowMs) {
        return "CRITICAL";
    }
    if (due <= nowMs + HOURS_72) {
        return "HIGH";
    }
    if (due <= nowMs + DAYS_7) {
        return "MEDIUM";
    }
    return "LOW";
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
    CRITICAL: 0,
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
};

export function compareTaskPriority(first: TaskPriority, second: TaskPriority): number {
    return PRIORITY_RANK[first] - PRIORITY_RANK[second];
}
