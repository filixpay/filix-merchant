export type CloseReasonCode =
    | "NO_LONGER_OPERATING"
    | "BUSINESS_CLOSED"
    | "SWITCH_PROVIDER"
    | "OTHER";

export type CloseRequestStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";

export interface MerchantCloseRequest {
    id: number;
    merchantId: number;
    status: CloseRequestStatus;
    reasonCode: CloseReasonCode;
    reasonRemark?: string;
    reviewNote?: string;
    reviewedBy?: string;
    reviewedAt?: string;
    submittedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateMerchantCloseRequestRequest {
    reasonCode: CloseReasonCode;
    reasonRemark?: string;
}

export const CLOSE_REASON_CODES: CloseReasonCode[] = [
    "NO_LONGER_OPERATING",
    "BUSINESS_CLOSED",
    "SWITCH_PROVIDER",
    "OTHER",
];

export const SUBMITTABLE_CLOSE_STATUSES: CloseRequestStatus[] = ["DRAFT"];

export const CANCELABLE_CLOSE_STATUSES: CloseRequestStatus[] = ["DRAFT", "SUBMITTED"];
