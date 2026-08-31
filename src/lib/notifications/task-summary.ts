import type { ActionTaskView } from "@/lib/api/domains/notifications/shared/contracts";
import { compareTaskPriority } from "./task-priority";

const HOUR_MS = 60 * 60 * 1000;
const HOURS_72 = 72 * HOUR_MS;

export interface TaskSummary {
    openTasks: number;
    overdue: number;
    dueSoon: number;
    actionRequired: number;
    topTask: ActionTaskView | null;
}

function isOverdue(dueAt: string, now: Date): boolean {
    return new Date(dueAt).getTime() <= now.getTime();
}

function isDueSoon(dueAt: string, now: Date): boolean {
    const due = new Date(dueAt).getTime();
    const nowMs = now.getTime();
    return due > nowMs && due <= nowMs + HOURS_72;
}

export function buildTaskSummary(
    tasks: ActionTaskView[],
    openTasksCount?: number,
    now = new Date(),
): TaskSummary {
    const openTasks = openTasksCount ?? tasks.length;
    const overdue = tasks.filter((task) => task.dueAt && isOverdue(task.dueAt, now)).length;
    const dueSoon = tasks.filter(
        (task) => task.dueAt && isDueSoon(task.dueAt, now),
    ).length;

    const sorted = [...tasks].sort((left, right) => {
        const byPriority = compareTaskPriority(left.priority, right.priority);
        if (byPriority !== 0) {
            return byPriority;
        }
        if (left.dueAt && right.dueAt) {
            return new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime();
        }
        return 0;
    });

    return {
        openTasks,
        overdue,
        dueSoon,
        actionRequired: openTasks,
        topTask: sorted[0] ?? null,
    };
}
