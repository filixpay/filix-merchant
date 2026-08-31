import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface PaymentSplitReceiver {
    id: number;
    paymentSplitId: number;
    receiverId: string;
    receiverName: string;
    receiverType: string;
    requestedAmount: number;
    actualAmount: number;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentSplitDetailView {
    id: number;
    merchantId: number;
    tradeNo: string;
    orderId: number;
    orderAmount: number;
    splitAmount: number;
    paymentSplitType: string;
    paymentSplitStatus: string;
    remark?: string;
    receiverCount: number;
    successCount: number;
    failureCount: number;
    version: number;
    createdAt: string;
    updatedAt: string;
    receivers: PaymentSplitReceiver[];
}

export interface PaymentSplitView {
    id: number;
    merchantId: number;
    tradeNo: string;
    orderId: number;
    orderAmount: number;
    splitAmount: number;
    paymentSplitType: string;
    paymentSplitStatus: string;
    remark?: string;
    receiverCount: number;
    successCount: number;
    failureCount: number;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export const paymentSplitsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<PaymentSplitView>(ENDPOINTS.PORTAL.PAYMENT_SPLITS, params, token),
    get: (id: number | string, token: string) => {
        return request<PaymentSplitDetailView>(
            `${ENDPOINTS.PORTAL.PAYMENT_SPLITS}/${id}`,
            { headers: authHeaders(token) },
        );
    },
};
