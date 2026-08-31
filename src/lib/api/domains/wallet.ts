import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import type { Amount } from "../types";
import type { OrderView } from "../orders";
import { pagedGet } from "../query";

/** Wallet deposit list row; fields vary by backend mapping. */
export interface DepositView {
    id?: number;
    depositId?: string;
    merchantOrderId?: string;
    tradeNo?: string;
    amount?: string;
    totalAmount?: Amount;
    status?: string;
    tradeStatus?: string;
    orderStatus?: string;
    createdAt?: string;
    paidAt?: string;
}

export interface WalletDepositRequest {
    amount: string;
}

export interface WalletTransferItemRequest {
    payeeCustomerCode: string;
    amount: number;
    memo?: string;
}

export interface WalletTransferCreateRequest {
    /** Canonical asset code matching the selected wallet balance (e.g. USD). */
    currency: string;
    transferItems: WalletTransferItemRequest[];
}

export const walletApi = {
    deposit: (data: WalletDepositRequest, token: string) =>
        request<DepositView>(ENDPOINTS.PORTAL.WALLET_DEPOSITS, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    listDeposits: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<DepositView>(ENDPOINTS.PORTAL.WALLET_DEPOSITS, params, token),
    createTransfer: (data: WalletTransferCreateRequest, token: string) =>
        request<OrderView>(ENDPOINTS.PORTAL.WALLET_TRANSFERS, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    listTransfers: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<OrderView>(ENDPOINTS.PORTAL.WALLET_TRANSFERS, params, token),
};
