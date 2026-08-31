import type { ApplicationMerchantType, ReviewDecisionType } from "../onboarding/types";

export type ChangeType = "LEGAL_INFO" | "BANK_ACCOUNT";

export type ChangeRequestStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "RETURNED"
    | "APPROVED"
    | "APPLYING"
    | "APPLY_FAILED"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";

export type ContactType = "NOTIFICATION_EMAIL" | "SUPPORT_EMAIL" | "PHONE";

export type ApplyPhase = "NONE" | "MERCHANT_UPDATED" | "EXTERNAL_SYNCED";

export interface MerchantChangeReturnItem {
    fieldCode: string;
    reason: string;
}

export interface MerchantChangeReview {
    id: string;
    reviewerId?: string;
    decision: ReviewDecisionType;
    comment: string;
    returnItems?: MerchantChangeReturnItem[];
    createdAt?: string;
}

export interface MerchantChangeProfile {
    id?: string;
    registrationCountry?: string;
    merchantType?: ApplicationMerchantType;
    schemaCode?: string;
    businessName?: string;
    phone?: string;
    email?: string;
    extraAttributes?: Record<string, unknown>;
}

export interface MerchantChangeRequest {
    id: string;
    changeType: ChangeType;
    status: ChangeRequestStatus;
    merchantId?: number;
    applyPhase?: ApplyPhase;
    returnedReason?: string;
    returnedAt?: string;
    returnCount?: number;
    applyRetryCount?: number;
    lastApplyErrorCode?: string;
    lastApplyFailedAt?: string;
    submittedAt?: string;
    approvedAt?: string;
    completedAt?: string;
    profile?: MerchantChangeProfile;
    reviews?: MerchantChangeReview[];
}

export interface MerchantChangeRequestListItem {
    id: string;
    changeType: ChangeType;
    status: ChangeRequestStatus;
    merchantId?: number;
    businessName?: string;
    registrationCountry?: string;
    submittedAt?: string;
    updatedAt?: string;
}

export interface CreateMerchantChangeRequestRequest {
    changeType: ChangeType;
    /** Required only when merchant.idCountry is blank (legacy merchants). */
    registrationCountry?: string;
}

export interface ChangeProfileRequest {
    businessName?: string;
    phone?: string;
    email?: string;
    extraAttributes?: Record<string, string>;
}

export interface UpdateMerchantContactRequest {
    contactType: ContactType;
    value: string;
}

export interface MerchantContactView {
    merchantId?: string;
    /** Notification email from GET /portal/merchant/contact. */
    email?: string | null;
    supportEmail?: string | null;
    phone?: string | null;
}

export interface ListChangeRequestsQuery {
    changeType?: ChangeType;
    status?: ChangeRequestStatus;
    page?: number;
    size?: number;
}

export const EDITABLE_CHANGE_STATUSES: ChangeRequestStatus[] = ["DRAFT", "RETURNED"];

export const CANCELABLE_CHANGE_STATUSES: ChangeRequestStatus[] = ["DRAFT", "SUBMITTED", "RETURNED"];

export const CHANGE_TYPES: ChangeType[] = ["LEGAL_INFO", "BANK_ACCOUNT"];

export const CONTACT_TYPES: ContactType[] = ["NOTIFICATION_EMAIL", "SUPPORT_EMAIL", "PHONE"];
