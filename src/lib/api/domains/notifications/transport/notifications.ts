import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import { pagedGet } from "@/lib/api/query";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import type { MerchantNotification, NotificationCounts, NotificationListQuery } from "../shared/contracts";
import type { MerchantNotificationDto, NotificationCountsDto } from "../shared/dto";
import { mapNotificationDto } from "../shared/mappers";

function buildNotificationParams(query: NotificationListQuery): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: query.page,
        size: query.size,
    };
    if (query.unread !== undefined) {
        params.unread = String(query.unread);
    }
    return params;
}

export async function fetchNotifications(token: string, query: NotificationListQuery) {
    const response = await pagedGet<MerchantNotificationDto>(
        ENDPOINTS.PORTAL.NOTIFICATIONS,
        buildNotificationParams(query),
        token,
    );
    const { items, total } = normalizePagedResponse(response);
    return {
        items: items.map(mapNotificationDto) satisfies MerchantNotification[],
        total,
    };
}

export async function fetchNotificationCounts(token: string): Promise<NotificationCounts> {
    return request<NotificationCountsDto>(ENDPOINTS.PORTAL.NOTIFICATION_COUNTS, {
        headers: authHeaders(token),
    });
}

export async function postMarkNotificationRead(id: string, token: string): Promise<void> {
    await request<null>(ENDPOINTS.PORTAL.NOTIFICATION_READ(id), {
        method: "POST",
        headers: authHeaders(token),
    });
}

export async function postMarkAllNotificationsRead(token: string): Promise<void> {
    await request<null>(ENDPOINTS.PORTAL.NOTIFICATION_READ_ALL, {
        method: "POST",
        headers: authHeaders(token),
    });
}
