import { API_BASE_URL, ENDPOINTS } from "../api-config";
import { ApiError, authHeaders, request } from "./core";
import {
    buildPortalHeaders,
    resolveClientOrganizationCode,
    resolveClientSelectedGroup,
} from "./portal-headers";
import type { Amount, PagedResponse } from "./types";

export interface TraceTimelineMetadata {
    eventSource?: string;
    provider?: string;
    channel?: string;
    reviewId?: string;
    fraudEventId?: string;
    reason?: string;
    primaryRule?: string;
    previousStatus?: string;
    newStatus?: string;
    webhookSource?: string;
    errorCode?: string;
    providerOccurredAt?: string;
    riskEvaluationPublicId?: string;
    riskActionPublicId?: string;
    planOrder?: number;
    decisionVersion?: string;
    extensions?: Record<string, unknown>;
}

export interface TraceTimelineItem {
    eventId: string;
    eventCategory?: string;
    eventCode?: string;
    paymentAttemptId?: number;
    createdAt?: string;
    metadata?: TraceTimelineMetadata;
}

export interface OrderDetailResponse {
    order: OrderView;
    lifecycleTimeline: TraceTimelineItem[];
}

export interface OrderItemView {
    businessProductId?: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    itemTotal?: number;
}

export interface OrderPartyView {
    id?: string;
    code?: string | number;
    name?: string;
    alias?: string;
}

export interface OrderView {
    /** System order id (`orders.id` UUID). */
    id: string;
    merchantOrderId: string;
    tradeNo: string;
    subject: string;
    totalAmount: Amount;
    paidAmount?: number;
    refundedAmount?: number;
    tradeStatus: string;
    channelCode: string;
    createdAt: string;
    updatedAt: string;
    paidAt?: string;
    sellerCode?: string | number;
    buyerCode?: string | number;
    seller?: OrderPartyView;
    buyer?: OrderPartyView;
    locationId?: number;
    subMerchantId?: number;
    orderType?: string;
    paymentAttemptId?: number;
    orderItems?: OrderItemView[];
}

export interface TodayOrderTotal {
    totalAmount: number;
    currency: string;
    totalCount: number;
}

export interface OrderItemRequest {
    businessProductId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface OrderCreateRequest {
    merchantOrderId: string;
    subject: string;
    returnUrl?: string;
    buyerId?: number;
    customerName?: string;
    customerEmail?: string;
    customermobile?: string;
    orderItems: OrderItemRequest[];
    totalAmount: Amount;
    paymentExpiredAt?: string;
    /**
     * @deprecated Prefer `collectionDestinationId` when `offlineTransfer` is true.
     * Receipt receiving ExternalAccount id (UUID string).
     */
    externalAccountId?: string;
    /** When true, backend requires and locks `collectionDestinationId`. */
    offlineTransfer?: boolean;
    /** Resolved Collection Destination id (mode-aware); required iff offlineTransfer. */
    collectionDestinationId?: string;
    locationId?: number;
    platformSettled?: boolean;
}

export type CollectionDestinationOwnerType = "PLATFORM" | "MERCHANT";

export type CollectionDestinationPurpose = "OFFLINE_MONEY_IN";

export interface CollectionDestinationView {
    id: string;
    externalAccountId: string;
    ownerType: CollectionDestinationOwnerType;
    bankName: string | null;
    accountHolderName: string | null;
    accountNumberMasked: string | null;
    accountNumberLast4: string | null;
    currency: string | null;
    status: string;
}

export interface CollectionDestinationResolveResponse {
    defaultDestinationId: string | null;
    items: CollectionDestinationView[];
}

export interface CollectionDestinationQuery {
    purpose?: CollectionDestinationPurpose;
}

export type ServicePeriod = "SEVEN_DAYS" | "THIRTY_DAYS" | "HALF_YEAR" | "ONE_YEAR";

export interface ServiceFeeOrderRequest {
    servicePeriod: ServicePeriod;
}

/** Backend trade status code (e.g. PENDING, SUCCESS, WAIT_BUYER_PAY). */
export type TradeStatus = string;

export interface MissingOrderView {
    id: number | string;
    mismatchType?: string;
    dealType?: string;
    amount?: number | string;
    channelCode?: string;
    channelTransactionId?: string;
    localStatus?: string;
    upstreamStatus?: string;
    createdAt?: string;
}

export const ordersApi = {
    listCollectionDestinations: (
        params: CollectionDestinationQuery = {},
        token: string,
    ): Promise<CollectionDestinationResolveResponse> => {
        const query = new URLSearchParams({
            purpose: params.purpose ?? "OFFLINE_MONEY_IN",
        }).toString();
        return request<CollectionDestinationResolveResponse>(
            `${ENDPOINTS.PORTAL.COLLECTION_DESTINATIONS}?${query}`,
            { headers: authHeaders(token) },
        );
    },
    create: (data: OrderCreateRequest, token: string) =>
        request<OrderView>(ENDPOINTS.PORTAL.ORDERS, {
            method: "POST",
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    createServiceFee: (data: ServiceFeeOrderRequest, token: string) =>
        request<OrderView>(ENDPOINTS.PORTAL.ORDERS_SERVICE_FEE, {
            method: "POST",
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    search: (params: Record<string, string | number> = {}, token: string) => {
        const query = new URLSearchParams(
            Object.entries(params).map(([key, value]) => [key, String(value)]),
        ).toString();
        return request<PagedResponse<OrderView>>(
            `${ENDPOINTS.PORTAL.ORDERS}${query ? `?${query}` : ""}`,
            { headers: authHeaders(token) },
        );
    },
    get: async (merchantOrderId: string, token: string) => {
        const data = await request<OrderDetailResponse | OrderView>(
            `${ENDPOINTS.PORTAL.ORDERS}/${merchantOrderId}`,
            { headers: authHeaders(token) },
        );
        return parseOrderDetail(data);
    },
    getById: async (orderId: string, token: string) => {
        const data = await request<OrderDetailResponse | OrderView>(
            `${ENDPOINTS.PORTAL.ORDERS}/by-id/${encodeURIComponent(orderId)}`,
            { headers: authHeaders(token) },
        );
        return parseOrderDetail(data);
    },
    getTodayOrderTotal: (token: string) =>
        request<TodayOrderTotal[]>(ENDPOINTS.PORTAL.ORDERS_TODAY_TOTAL, {
            headers: authHeaders(token),
        }),
    getPaymentToken: async (merchantOrderId: string, token: string): Promise<string> => {
        const path = `${ENDPOINTS.PORTAL.ORDERS}/${merchantOrderId}/payment-token`;
        const url = `${API_BASE_URL}${path}`;
        const response = await fetch(url, {
            headers: buildPortalHeaders({
                token,
                selectedGroup: resolveClientSelectedGroup(),
                organizationCode: resolveClientOrganizationCode(),
            }),
        });
        const data = await response.json();
        if (
            !response.ok ||
            data.success === false ||
            (data.code !== 0 && data.code !== "SUCCESS")
        ) {
            throw new ApiError(
                data.message || `Request failed with status ${response.status}`,
                response.status,
                data.code,
            );
        }
        return data.message;
    },
    checkMissingOrder: (merchantOrderId: string, token: string) =>
        request<MissingOrderView | null>(`${ENDPOINTS.PORTAL.ORDERS}/${merchantOrderId}/payment-status`, {
            headers: authHeaders(token),
        }),
    patchOrder: (id: number | string, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.ERRORS}/${id}/reconcile`, {
            method: "POST",
            headers: authHeaders(token),
        }),
};

export function parseOrderDetail(data: OrderDetailResponse | OrderView): OrderDetailResponse {
    if (data && typeof data === "object" && "order" in data && data.order) {
        return {
            order: data.order,
            lifecycleTimeline: data.lifecycleTimeline ?? [],
        };
    }
    return { order: data as OrderView, lifecycleTimeline: [] };
}
