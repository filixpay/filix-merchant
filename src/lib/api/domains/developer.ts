import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface ApiCredentialsView {
    clientId: string;
    clientSecret: string;
    createdAt?: string;
}

export type WebhookEndpointStatus = "ACTIVE" | "DISABLED";

export interface WebhookEndpointView {
    id: string;
    url: string;
    description?: string;
    eventTypes: string[];
    environment: "LIVE" | "SANDBOX";
    /** Domain lifecycle status (G7.1). Prefer over legacy enabled. */
    status: WebhookEndpointStatus;
    secret?: string;
    createdAt: string;
}

export interface WebhookEndpointRequest {
    url: string;
    description?: string;
    eventTypes: string[];
    /** Required on create; immutable after create. */
    environment: "LIVE" | "SANDBOX";
}

export interface WebhookStatusUpdateRequest {
    status: WebhookEndpointStatus;
}

export interface WebhookDeliveryView {
    id: string;
    webhookEventId: string;
    webhookEndpointId: string;
    webhookUrl: string;
    payload: string;
    attemptNumber: number;
    deliveryStatus: string;
    signType: string;
    signature: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

function normalizeWebhookEndpoint(row: WebhookEndpointView & { enabled?: boolean }): WebhookEndpointView {
    const status: WebhookEndpointStatus =
        row.status === "ACTIVE" || row.status === "DISABLED"
            ? row.status
            : row.enabled === false
              ? "DISABLED"
              : "ACTIVE";
    return {
        ...row,
        id: String(row.id),
        status,
    };
}

export const developerApi = {
    createWebhookEndpoint: async (data: WebhookEndpointRequest, token: string) => {
        const created = await request<WebhookEndpointView & { enabled?: boolean }>(
            ENDPOINTS.PORTAL.DEVELOPER_WEBHOOKS,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: authHeaders(token),
            },
        );
        return normalizeWebhookEndpoint(created);
    },
    listWebhookEndpoints: async (
        params: Record<string, string | number> = {},
        token: string,
    ) => {
        const res = await pagedGet<WebhookEndpointView & { enabled?: boolean }>(
            ENDPOINTS.PORTAL.DEVELOPER_WEBHOOKS,
            params,
            token,
        );
        const rows = (res.data || res.content || []).map(normalizeWebhookEndpoint);
        return { ...res, data: rows, content: rows };
    },
    patchWebhookEndpointStatus: async (
        id: string,
        body: WebhookStatusUpdateRequest,
        token: string,
    ) => {
        const updated = await request<WebhookEndpointView & { enabled?: boolean }>(
            `${ENDPOINTS.PORTAL.DEVELOPER_WEBHOOKS}/${encodeURIComponent(id)}`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
                headers: authHeaders(token),
            },
        );
        return normalizeWebhookEndpoint(updated);
    },
    deleteWebhookEndpoint: (id: string, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.DEVELOPER_WEBHOOKS}/${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: authHeaders(token),
        }),
    listWebhookDeliveries: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<WebhookDeliveryView>(ENDPOINTS.PORTAL.DEVELOPER_WEBHOOK_DELIVERIES, params, token),
    redeliverWebhookDelivery: (id: string, token: string) =>
        request<void>(
            `${ENDPOINTS.PORTAL.DEVELOPER_WEBHOOK_DELIVERIES}/${encodeURIComponent(id)}/redeliver`,
            {
                method: "POST",
                headers: authHeaders(token),
            },
        ),
};
