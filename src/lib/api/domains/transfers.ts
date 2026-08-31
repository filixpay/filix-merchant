import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import type { Amount } from "../types";
import type { OrderView } from "../orders";
import { pagedGet } from "../query";

export type TransferId = string | number;

export interface TransferView {
    id: TransferId;
    transactionId: string;
    payeeAccountHolder: string;
    payeeAccountNumber: string;
    payeeBankName: string;
    payerAccountHolder: string;
    payerAccountNumber: string;
    payerBankName: string;
    transferStatus: string;
    reviewStatus: 'INITIAL' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETURNED' | 'NONEED';
    approvalStatus: 'NONEED' | 'PENDING' | 'APPROVED' | 'REJECTED';
    auditOperator?: string;
    reviewOperator?: string;
    auditDate?: string;
    reviewDate?: string;
    rejectedReason?: string;
    rejectReason?: string;
    transferType: string;
    totalAmount: number;
    fee: number;
    fileId: number;
    version: number;
    createdAt: string;
    updatedAt: string;
    makerAck?: boolean | null;
    checkerAck?: boolean | null;
    actualReceivedAmount?: number | null;
    bankTransactionAt?: string | null;
    exceptionNote?: string | null;
    invoice?: {
        totalAmount: Amount;
    };
    order?: OrderView;
    customerId: number;
}

export interface FileMeta {
    fileId: number;
    fileName: string;
    fileBase64: string | null;
    fileUrl: string | null;
    mimeType: string;
}

export interface TransferDetailResponse {
    transfer: TransferView;
    fileMeta?: FileMeta;
}

export interface TransferAuditRequest {
    transactionId?: string;
    payerAccountHolder?: string;
    payerAccountNumber?: string;
    payerBankName?: string;
    approvalStatus: 'APPROVED' | 'REJECTED';
    rejectedReason?: string;
    makerAck: boolean;
    actualReceivedAmount?: number;
    bankTransactionAt?: string;
    exceptionNote?: string;
}

export interface TransferReviewRequest {
    reviewStatus: 'SUCCESS' | 'FAILED' | 'RETURNED';
    rejectedReason?: string | null;
    checkerAck?: boolean;
}

export const transfersApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<TransferView>(ENDPOINTS.PORTAL.TRANSFERS, params, token),
    get: (id: TransferId, token: string) =>
        request<TransferDetailResponse>(`${ENDPOINTS.PORTAL.TRANSFERS}/${id}`, {
            headers: authHeaders(token),
        }),
    audit: (id: TransferId, data: TransferAuditRequest, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.TRANSFERS}/${id}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    confirm: (id: TransferId, data: TransferReviewRequest, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.TRANSFERS}/${id}/confirm`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
};
