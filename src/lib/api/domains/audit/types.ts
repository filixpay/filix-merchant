export type AuditActorType =
    | "MERCHANT_USER"
    | "OPERATOR"
    | "SYSTEM"
    | "API"
    | "WEBHOOK"
    | "ENTERPRISE_MEMBER";

export type AuditActionCategory =
    | "AUTH"
    | "APIKEY"
    | "WEBHOOK"
    | "MERCHANT"
    | "COVERAGE"
    | "RISK"
    | "ROLE"
    | "OPERATOR"
    | "PAYMENT"
    | "SETTLEMENT"
    | "WALLET"
    | "ORGANIZATION"
    | "ENTERPRISE";

export type AuditResult = "SUCCESS" | "FAILURE" | "DENIED";

export interface AuditMetadata {
    version?: number;
    changedFields?: string[];
    oldHash?: string;
    newHash?: string;
    truncated?: boolean;
    extra?: Record<string, unknown>;
}

export interface AuditLogItem {
    eventId: string;
    occurredAt: string;
    requestId?: string;
    traceId?: string;
    actorType: AuditActorType;
    actorId: string;
    actorDisplayName: string;
    actorNameSnapshot?: string;
    action: string;
    actionCategory: AuditActionCategory;
    resourceType?: string;
    resourceId?: string;
    result: AuditResult;
    reason?: string;
    metadata?: AuditMetadata;
}

export interface AuditLogPage {
    items: AuditLogItem[];
    page: number;
    size: number;
    totalElements: number;
    nextCursor: string | null;
}

export interface AuditLogListQuery {
    from?: string;
    to?: string;
    actionCategory?: AuditActionCategory;
    action?: string;
    result?: AuditResult;
    page?: number;
    size?: number;
}
