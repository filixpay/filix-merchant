export interface MerchantNotificationDto {
    id: string;
    category: string;
    eventType: string;
    severity: string;
    title: string;
    content?: string;
    actionPath?: string;
    readAt?: string | null;
    createdAt: string;
}

export interface ActionTaskDto {
    id: string;
    taskType: string;
    status: string;
    title: string;
    description?: string;
    dueAt?: string;
    actionPath?: string;
    payload?: string;
    resolvedReason?: string;
    createdAt?: string;
}

export interface NotificationCountsDto {
    unreadNotifications: number;
    openTasks: number;
}
