import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";

export type CommerceFulfillmentRowStatus = "REQUESTED" | "FULFILLED" | "FAILED";

export type CommerceOrderFulfillmentStatus = "UNFULFILLED" | "FULFILLED";

export type CommerceFulfillmentDetailItem = {
    id: string;
    status: CommerceFulfillmentRowStatus;
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string | null;
    requestedAt?: string | null;
    externalFulfillmentId?: string | null;
    statusLabel?: string | null;
};

export type CommerceOrderFulfillmentDetail = {
    fulfillmentStatus: CommerceOrderFulfillmentStatus;
    fulfillments: CommerceFulfillmentDetailItem[];
};

export type FulfillCommerceOrderBody = {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
};

export type CommerceFulfillmentResponse = {
    id: string;
    status: CommerceFulfillmentRowStatus;
    externalReference?: string;
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string | null;
    externalFulfillmentId?: string | null;
    requestedAt?: string | null;
};

function orderBase(orderId: string): string {
    return `${ENDPOINTS.PORTAL.COMMERCE_ORDERS}/${encodeURIComponent(orderId)}`;
}

export async function getFulfillmentDetail(
    token: string,
    orderId: string,
): Promise<CommerceOrderFulfillmentDetail> {
    return request<CommerceOrderFulfillmentDetail>(orderBase(orderId), {
        headers: authHeaders(token),
    });
}

export async function fulfillCommerceOrder(
    token: string,
    orderId: string,
    idempotencyKey: string,
    body: FulfillCommerceOrderBody,
): Promise<CommerceFulfillmentResponse> {
    return request<CommerceFulfillmentResponse>(`${orderBase(orderId)}/fulfill`, {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(body),
    });
}
