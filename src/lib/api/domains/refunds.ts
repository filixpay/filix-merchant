import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import type { Amount } from "../types";
import { pagedGet } from "../query";

/** Runtime RefundStatus values. */
export type RefundStatus =
    | "REQUESTED"
    | "EXECUTING"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELLED"
    | string;

export type RefundTimelineEventCode =
    | "REQUESTED"
    | "AWAITING_APPROVAL"
    | "EXECUTING"
    | "ATTEMPT_CREATED"
    | "ATTEMPT_SUBMITTING"
    | "ATTEMPT_SUBMITTED"
    | "ATTEMPT_FAILED_SUBMIT"
    | "ATTEMPT_SUCCEEDED"
    | "ATTEMPT_FAILED"
    | "SUCCEEDED"
    | "FAILED"
    | "CANCELLED"
    | string;

export interface RefundTimelineEvent {
    code: RefundTimelineEventCode;
    at?: string;
    attemptNo?: number;
    detail?: string;
}

export interface RefundCreateRequest {
    tradeNo: string;
    /** Preferred Runtime field name (backend also accepts legacy merchantReundId). */
    merchantRefundId: string;
    reason: string;
    totalAmount: Amount;
}

/** Merchant portal Runtime refund view (not legacy RefundOrder). */
export interface RefundView {
    refundId: string;
    merchantRefundId: string;
    amount: number;
    status: RefundStatus;
    approvalStatus?: string;
    reason?: string;
    createdAt?: string;
    completedAt?: string;
    paymentId?: string;
    metadata?: string;
    timeline?: RefundTimelineEvent[];
    awaitingApproval?: boolean;
    autoExecuteThreshold?: string;
}

export type RefundSettings = {
    settlementCurrency: string;
    /** Effective threshold shown in UI (platform default when not configured). */
    threshold: string;
    unlimited: boolean;
    platformDefaultThreshold: string;
    usingPlatformDefault: boolean;
    /** Compat aliases from settings API. */
    autoRefundThreshold?: string | null;
    autoRefundUnlimited?: boolean;
};

export type RefundSettingsUpdateRequest = {
    autoRefundThreshold?: string | number | null;
    autoRefundUnlimited?: boolean;
};

export const refundSettingsApi = {
    get: (token: string) =>
        request<RefundSettings>(ENDPOINTS.PORTAL.REFUND_SETTINGS, {
            headers: authHeaders(token),
        }),
    update: (body: RefundSettingsUpdateRequest, token: string) =>
        request<RefundSettings>(ENDPOINTS.PORTAL.REFUND_SETTINGS, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: authHeaders(token),
        }),
};

export const refundsApi = {
    create: (data: RefundCreateRequest, token: string) =>
        request<RefundView>(ENDPOINTS.PORTAL.REFUNDS, {
            method: "POST",
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<RefundView>(ENDPOINTS.PORTAL.REFUNDS, params, token),
    listPendingApproval: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<RefundView>(ENDPOINTS.PORTAL.REFUNDS_PENDING_APPROVAL, params, token),
    get: (merchantRefundId: string, token: string) =>
        request<RefundView>(`${ENDPOINTS.PORTAL.REFUNDS}/${encodeURIComponent(merchantRefundId)}`, {
            headers: authHeaders(token),
        }),
    approve: (merchantRefundId: string, token: string) =>
        request<RefundView>(
            `${ENDPOINTS.PORTAL.REFUNDS}/${encodeURIComponent(merchantRefundId)}/approve`,
            {
                method: "POST",
                headers: authHeaders(token),
            },
        ),
    reject: (merchantRefundId: string, token: string) =>
        request<RefundView>(
            `${ENDPOINTS.PORTAL.REFUNDS}/${encodeURIComponent(merchantRefundId)}/reject`,
            {
                method: "POST",
                headers: authHeaders(token),
            },
        ),
};
