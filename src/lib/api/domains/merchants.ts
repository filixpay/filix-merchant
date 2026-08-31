import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface MerchantRequest {
    mobile: string;
    email: string;
    name: string;
    officialIdNumber: string;
    settlementMode: 'DIRECT' | 'PLATFORM';
    /** ISO 4217; required; immutable after create. */
    settlementCurrency: string;
}

export interface MerchantView {
    merchantId: number;
    mobile: string;
    email: string;
    name: string;
    officialIdNumber: string;
    merchantType: string;
    storeType: string;
    status: 'PENDING_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
    createdAt: string;
}

export interface MerchantDetailView {
    id: number;
    code: number | string;
    name: string;
    merchantType: string;
    /** Jackson enum name from MerchantTier (e.g. TRIAL, STANDARD). */
    merchantTier: string;
    storeType: string;
    officialIdNumber: string;
    officialIdType: string;
    longTermId: boolean;
    customerStatus: string;
    email: string;
    mobile?: string;
    idCountry?: string;
    address?: string;
    paymentPinAttempts: number;
    accountOpeningStatus: string;
    alias?: string;
    settlementMode?: 'DIRECT' | 'PLATFORM';
    createdAt: string;
    updatedAt: string;
    version: number;
}

export interface MerchantBalanceAccountView {
    assetCode: string;
    availablePayable: number;
    pendingPayable: number;
}

export interface MerchantBalanceView {
    environment?: string;
    ownerId?: string;
    source?: string;
    accounts?: MerchantBalanceAccountView[];
    /** Legacy single-asset compat (filled only when exactly one asset). */
    WITHDRAWABLE: number;
    LIABILITY: number;
    TRANSFERIN?: number;
    TRANSFEROUT?: number;
    SERVICE?: number;
}

export type MerchantPortalBucket = "AVAILABLE" | "PENDING";

export interface MerchantLedgerMovementView {
    postedAt: string;
    journalNumber: string;
    /** API business type code (e.g. PAYMENT); localize in UI. */
    businessType: string;
    businessId: string;
    externalReference?: string | null;
    direction: "DEBIT" | "CREDIT";
    amount: number;
    currency: string;
    bucket: MerchantPortalBucket | string;
    movementId: string;
    entryId: string;
    transactionId: string;
    /** Optional running balance after this movement; omit when API does not provide it. */
    balanceAfter?: number | string | null;
}

export interface MerchantLookupByCodeView {
    code: number | string;
    name: string;
    alias?: string;
    customerStatus: string;
}

export interface TrialMerchantCreateResult {
    merchantCode: number | string;
    merchant?: unknown;
}

export const merchantsApi = {
    create: (data: MerchantRequest, token: string) =>
        request<TrialMerchantCreateResult>(ENDPOINTS.PUBLIC.MERCHANTS, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(data),
        }),
    getDetail: (token: string) =>
        request<MerchantDetailView>(ENDPOINTS.PORTAL.MERCHANT, { headers: authHeaders(token) }),
    list: (token: string) =>
        request<MerchantDetailView[]>(ENDPOINTS.PORTAL.MERCHANTS, { headers: authHeaders(token) }),
    createPortalMerchant: (token: string) =>
        request<MerchantDetailView>(ENDPOINTS.PORTAL.MERCHANTS, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify({}),
        }),
    lookupByCode: (code: string, token: string) =>
        request<MerchantLookupByCodeView>(
            `${ENDPOINTS.PORTAL.MERCHANTS_LOOKUP_BY_CODE}?code=${encodeURIComponent(code)}`,
            { headers: authHeaders(token) },
        ),
    getBalance: (token: string) =>
        request<MerchantBalanceView>(ENDPOINTS.PORTAL.MERCHANT_BALANCE, { headers: authHeaders(token) }),
    getLedgerMovements: (
        params: {
            /** Required — Overview must not rely on server default asset. */
            assetCode: string;
            bucket: MerchantPortalBucket;
            page?: number;
            size?: number;
        },
        token: string,
    ) =>
        pagedGet<MerchantLedgerMovementView>(ENDPOINTS.PORTAL.MERCHANT_LEDGER_MOVEMENTS, params, token),
};
