export type NotificationSeverity = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

export interface MerchantNotification {
    id: string;
    category: string;
    eventType: string;
    severity: NotificationSeverity;
    title: string;
    content?: string;
    actionPath?: string;
    readAt?: string | null;
    createdAt: string;
}

export type TaskStatus = "OPEN" | "COMPLETED" | "CANCELLED" | "EXPIRED";
export type TaskPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface ActionTask {
    id: string;
    taskType: string;
    status: TaskStatus;
    title: string;
    description?: string;
    dueAt?: string;
    actionPath?: string;
    payload?: Record<string, unknown>;
    resolvedReason?: string;
    createdAt?: string;
}

export interface ActionTaskView extends ActionTask {
    priority: TaskPriority;
}

export interface NotificationCounts {
    unreadNotifications: number;
    openTasks: number;
}

export interface NotificationListQuery {
    page: number;
    size: number;
    unread?: boolean;
}

export interface TaskListQuery {
    page: number;
    size: number;
    status?: TaskStatus;
}
