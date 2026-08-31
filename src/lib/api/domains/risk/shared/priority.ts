import { RiskPriority } from "./contracts";
import { DisputeStatus } from "./contracts";

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export function computePriorityFromDueDate(responseDueAt: string, now = new Date()): RiskPriority {
    const dueMs = new Date(responseDueAt).getTime() - now.getTime();

    if (dueMs <= 0) {
        return RiskPriority.CRITICAL;
    }
    if (dueMs <= MS_PER_DAY) {
        return RiskPriority.HIGH;
    }
    if (dueMs <= 3 * MS_PER_DAY) {
        return RiskPriority.MEDIUM;
    }
    return RiskPriority.LOW;
}

export function isDueSoon(responseDueAt: string, now = new Date()): boolean {
    const dueMs = new Date(responseDueAt).getTime() - now.getTime();
    return dueMs > 0 && dueMs <= 3 * MS_PER_DAY;
}

export function isOverdue(responseDueAt: string, now = new Date()): boolean {
    return new Date(responseDueAt).getTime() <= now.getTime();
}

export function requiresMerchantAction(status: DisputeStatus): boolean {
    return status === DisputeStatus.DRAFT;
}
