import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import type { PagedResponse } from "@/lib/api/types";
import type { WebhookDeliveryView } from "@/lib/api/domains/developer";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import { merchantPortalFetch } from "@/lib/developer/merchant-portal-fetch";

type DeliveriesResponse = {
    success?: boolean;
    code?: number | string;
    message?: string;
    data?: WebhookDeliveryView[] | PagedResponse<WebhookDeliveryView>;
    content?: WebhookDeliveryView[];
};

function normalizeDeliveriesList(data: DeliveriesResponse): WebhookDeliveryView[] {
    if (Array.isArray(data.content)) {
        return data.content;
    }

    const payload = data.data;
    if (Array.isArray(payload)) {
        return payload;
    }

    if (payload && typeof payload === "object") {
        return normalizePagedResponse(payload as PagedResponse<WebhookDeliveryView>).items;
    }

    return [];
}

export async function listMerchantWebhookDeliveries(
    accessToken: string,
    params: { page?: number; size?: number; selectedGroup?: string } = {},
): Promise<WebhookDeliveryView[]> {
    const query = new URLSearchParams({
        page: String(params.page ?? 0),
        size: String(params.size ?? 50),
    });

    const response = await merchantPortalFetch(
        `${API_BASE_URL}${ENDPOINTS.PORTAL.DEVELOPER_WEBHOOK_DELIVERIES}?${query}`,
        {
            token: accessToken,
            selectedGroup: params.selectedGroup,
        },
    );

    let data: DeliveriesResponse;
    try {
        data = (await response.json()) as DeliveriesResponse;
    } catch {
        throw new Error(`Failed to list webhook deliveries (${response.status})`);
    }

    if (!response.ok || data.success === false) {
        throw new Error(data.message ?? `Failed to list webhook deliveries (${response.status})`);
    }

    return normalizeDeliveriesList(data);
}
