export type ApplicationStatus =
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "RETURNED"
    | "APPROVED"
    | "PROVISIONING"
    | "PROVISION_FAILED"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";

export type ApplicationType = "NEW" | "UPGRADE";

export type ApplicationMerchantType = "LEGAL_ENTITY";

export type ReviewDecisionType = "APPROVE" | "RETURN" | "REJECT";

export type SchemaFieldClassification = "NORMAL" | "SENSITIVE" | "PII";

export type SchemaFieldType = "text" | "document";

export interface SchemaFieldMaintenanceMeta {
    editable: boolean;
    requiresReview: boolean;
}

export interface SchemaFieldDto {
    name: string;
    storage: "core" | "extra";
    classification: SchemaFieldClassification;
    maintenance?: SchemaFieldMaintenanceMeta;
    type?: SchemaFieldType;
    required?: boolean;
    label?: string;
}

export interface ApplicationDocument {
    fieldCode: string;
    fileId: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    sha256?: string;
    uploadedAt: string;
}

export interface ApplicationSchemaDto {
    schemaCode: string;
    registrationCountry: string;
    merchantType: ApplicationMerchantType;
    fields: SchemaFieldDto[];
}

export interface ApplicationProfile {
    id?: string;
    registrationCountry?: string;
    merchantType?: ApplicationMerchantType;
    schemaCode?: string;
    businessName?: string;
    phone?: string;
    email?: string;
    settlementCurrency?: string;
    /** True when upgrading from trial — currency was fixed at registration. */
    settlementCurrencyLocked?: boolean;
    extraAttributes?: Record<string, string>;
}

export interface ApplicationReturnItem {
    fieldCode: string;
    reason: string;
}

export interface ApplicationReview {
    id: string;
    reviewerId?: string;
    decision: ReviewDecisionType;
    comment: string;
    returnItems?: ApplicationReturnItem[];
    createdAt?: string;
}

export interface MerchantApplication {
    id: string;
    applicationType: ApplicationType;
    status: ApplicationStatus;
    merchantId?: string;
    tierTarget?: string;
    returnedReason?: string;
    returnedAt?: string;
    returnCount?: number;
    provisionRetryCount?: number;
    lastProvisionErrorCode?: string;
    lastProvisionFailedAt?: string;
    submittedAt?: string;
    approvedAt?: string;
    completedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    profile?: ApplicationProfile;
    reviews?: ApplicationReview[];
}

export interface CreateMerchantApplicationRequest {
    applicationType?: ApplicationType;
    registrationCountry: string;
    merchantType: ApplicationMerchantType;
}

export interface ApplicationProfileRequest {
    registrationCountry?: string;
    merchantType?: ApplicationMerchantType;
    schemaCode?: string;
    businessName?: string;
    phone?: string;
    email?: string;
    settlementCurrency?: string;
    extraAttributes?: Record<string, string>;
}

export const EDITABLE_APPLICATION_STATUSES: ApplicationStatus[] = ["DRAFT", "RETURNED"];

export const TERMINAL_APPLICATION_STATUSES: ApplicationStatus[] = [
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
];

export const REAPPLYABLE_APPLICATION_STATUSES: ApplicationStatus[] = ["REJECTED", "CANCELLED"];

export const APPLICATION_ID_STORAGE_KEY = "filix.merchantApplicationId";

const APPLICATION_ID_RE =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/** Parse route/storage application id; backend uses UUID after hard-cut. */
export function parseApplicationId(raw: unknown): string | null {
    const id = Array.isArray(raw) ? raw[0] : raw;
    if (typeof id !== "string" || !APPLICATION_ID_RE.test(id)) {
        return null;
    }
    return id;
}
