import {
    fetchNotificationCounts,
    fetchNotifications,
    postMarkAllNotificationsRead,
    postMarkNotificationRead,
} from "./transport/notifications";
import { fetchTasks } from "./transport/tasks";
import type { NotificationListQuery, TaskListQuery } from "./shared/contracts";

export const notificationsApi = {
    list: (token: string, query: NotificationListQuery) => fetchNotifications(token, query),
    listTasks: (token: string, query: TaskListQuery) => fetchTasks(token, query),
    getCounts: (token: string) => fetchNotificationCounts(token),
    markRead: (id: string, token: string) => postMarkNotificationRead(id, token),
    markAllRead: (token: string) => postMarkAllNotificationsRead(token),
};

export type {
    MerchantNotification,
    ActionTask,
    ActionTaskView,
    NotificationCounts,
    NotificationSeverity,
    TaskStatus,
    TaskPriority,
    NotificationListQuery,
    TaskListQuery,
} from "./shared/contracts";
