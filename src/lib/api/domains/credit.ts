import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface CreditorView {
    id: number;
    code: number | string;
    name: string;
    email: string;
    officialIdNumber: string;
    officialIdType: string;
    merchantTier: string;
    settlementMode: string;
    customerStatus: string;
    accountOpeningStatus: string;
    createdAt: string;
    updatedAt: string;
    version: number;
}

export interface DebitorView {
    id: number;
    code: number | string;
    name: string;
    alias?: string;
    email: string;
    officialIdNumber: string;
    officialIdType: string;
    merchantTier: string;
    settlementMode: string;
    customerStatus: string;
    accountOpeningStatus: string;
    createdAt: string;
    updatedAt: string;
    version: number;
}

export interface CreditLineView {
    id: number;
    creditLineSource: string;
    creditor: CreditorView;
    debitor: DebitorView;
    creditLimit: number;
    usedAmount: number;
    availableAmount: number;
    paymentTermType: string;
    paymentTermDays: string;
    activeStatus: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCreditLineRequest {
    debitorCode: number | string;
    creditLimit: number;
    paymentTermType: 'IMMEDIATE' | 'NET_DAYS' | 'END_OF_MONTH' | 'ON_DELIVERY' | 'STAGE_BASED';
    paymentTermDays?: string | number;
}

export interface CreditLineAdjustmentView {
    id: number;
    operator: string;
    oldLimit: number;
    newLimit: number;
    amount: number;
    creditLine: CreditLineView;
    createdAt: string;
    updatedAt: string;
}

export interface CreditTransactionView {
    id: number;
    creditorId: number;
    debitorId: number;
    businessId: string;
    creditTransactionType: 'USE' | 'REPAY' | 'ADJUST' | 'REFUND';
    usedAmountBefore: number;
    usedAmountAfter: number;
    amount: number;
    creditLine: CreditLineView;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export const creditApi = {
    listLines: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<CreditLineView>(ENDPOINTS.PORTAL.CREDIT_LINES, params, token),
    createLine: (data: CreateCreditLineRequest, token: string) =>
        request<void>(ENDPOINTS.PORTAL.CREDIT_LINES, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(data),
        }),
    listAdjustments: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<CreditLineAdjustmentView>(ENDPOINTS.PORTAL.CREDIT_LINE_ADJUSTMENTS, params, token),
    adjustLimit: (data: { creditLineId: number; amount: number }, token: string) =>
        request<void>(ENDPOINTS.PORTAL.CREDIT_LINE_ADJUSTMENTS, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(data),
        }),
    listTransactions: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<CreditTransactionView>(ENDPOINTS.PORTAL.CREDIT_TRANSACTIONS, params, token),
};
