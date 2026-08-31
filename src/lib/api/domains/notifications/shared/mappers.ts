import type {
    ActionTask,
    MerchantNotification,
    NotificationSeverity,
    TaskStatus,
} from "./contracts";
import type { ActionTaskDto, MerchantNotificationDto } from "./dto";

const SEVERITIES: NotificationSeverity[] = ["INFO", "SUCCESS", "WARNING", "ERROR"];
const TASK_STATUSES: TaskStatus[] = ["OPEN", "COMPLETED", "CANCELLED", "EXPIRED"];

function asSeverity(raw: string): NotificationSeverity {
    return SEVERITIES.includes(raw as NotificationSeverity) ? (raw as NotificationSeverity) : "INFO";
}

function asTaskStatus(raw: string): TaskStatus {
    return TASK_STATUSES.includes(raw as TaskStatus) ? (raw as TaskStatus) : "OPEN";
}

export function safeParsePayload(raw?: string): Record<string, unknown> | undefined {
    if (!raw) {
        return undefined;
    }
    try {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return parsed as Record<string, unknown>;
        }
    } catch {
        return undefined;
    }
    return undefined;
}

export function mapNotificationDto(dto: MerchantNotificationDto): MerchantNotification {
    return {
        id: dto.id,
        category: dto.category,
        eventType: dto.eventType,
        severity: asSeverity(dto.severity),
        title: dto.title,
        content: dto.content,
        actionPath: dto.actionPath,
        readAt: dto.readAt,
        createdAt: dto.createdAt,
    };
}

export function mapActionTaskDto(dto: ActionTaskDto): ActionTask {
    return {
        id: dto.id,
        taskType: dto.taskType,
        status: asTaskStatus(dto.status),
        title: dto.title,
        description: dto.description,
        dueAt: dto.dueAt,
        actionPath: dto.actionPath,
        payload: safeParsePayload(dto.payload),
        resolvedReason: dto.resolvedReason,
        createdAt: dto.createdAt,
    };
}
