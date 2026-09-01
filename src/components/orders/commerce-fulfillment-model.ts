import type { OrderView } from "@/lib/api";
import type {
    CommerceFulfillmentDetailItem,
    CommerceOrderFulfillmentDetail,
} from "@/lib/api/domains/commerce/fulfillment";

export const COMMERCE_ORDER_ID_PREFIX = "SALEOR-";

export function isCommerceOrder(order: Pick<OrderView, "merchantOrderId"> | null | undefined): boolean {
    const id = order?.merchantOrderId?.trim();
    return Boolean(id?.startsWith(COMMERCE_ORDER_ID_PREFIX));
}

export function isOrderPaidForFulfillment(order: Pick<OrderView, "tradeStatus"> | null | undefined): boolean {
    return order?.tradeStatus === "SUCCESS";
}

export function hasFulfillmentInProgress(detail: CommerceOrderFulfillmentDetail | null | undefined): boolean {
    return detail?.fulfillments?.some((row) => row.status === "REQUESTED") ?? false;
}

export function canSubmitCommerceFulfillment(
    order: Pick<OrderView, "tradeStatus"> | null | undefined,
    detail: CommerceOrderFulfillmentDetail | null | undefined,
): boolean {
    if (!isOrderPaidForFulfillment(order)) {
        return false;
    }
    if (!detail) {
        return false;
    }
    if (detail.fulfillmentStatus === "FULFILLED") {
        return false;
    }
    if (hasFulfillmentInProgress(detail)) {
        return false;
    }
    return true;
}

export function createFulfillmentIdempotencyKey(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `fulfill-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function fulfillmentRowStatusKey(
    status: CommerceFulfillmentDetailItem["status"],
): "requested" | "fulfilled" | "failed" {
    switch (status) {
        case "FULFILLED":
            return "fulfilled";
        case "FAILED":
            return "failed";
        default:
            return "requested";
    }
}
