import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface PayoutApplicationView {
    id: number;
    totalAmount: number;
    fee: number;
    buyerCode?: number | string;
    sellerCode?: number | string;
    approvalStatus: string;
    orderId: number;
    sellerName: string;
    buyerName: string;
    payoutStatus: string;
    totalCount: number;
    successCount: number;
    errCount: number;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface PayoutView {
    id: number;
    totalAmount: number;
    status: string;
    reviewStatus: string;
    buyerCode?: number | string;
    sellerCode?: number | string;
    memo?: string;
    payeeCustomerId?: number;
    payeeAccountHolder: string;
    payeeAccountNumber: string;
    payerAccountHolder: string;
    payerAccountNumber: string;
    payeeBankName: string;
    buyerName: string;
    payoutApplicationId?: number;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export const payoutsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<PayoutView>(ENDPOINTS.PORTAL.PAYOUTS, params, token),
    listApplications: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<PayoutApplicationView>(ENDPOINTS.PORTAL.PAYOUT_APPLICATIONS, params, token),
    auditApplication: (id: number, data: { approvalStatus: 'APPROVED' | 'REJECTED', rejectedReason?: string | null }, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.PAYOUT_APPLICATIONS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    listPlatformPayouts: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<PayoutView>(ENDPOINTS.PORTAL.PLATFORM_PAYOUTS, params, token),
    reviewPlatformPayout: (id: number, data: { reviewStatus: 'SUCCESS' | 'FAILED', rejectedReason?: string | null }, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.PLATFORM_PAYOUT_REVIEW}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
};
