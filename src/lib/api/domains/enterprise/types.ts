export type EnterpriseMembershipKind = "ADMIN" | "VIEWER";

export type EnterpriseMembershipStatus = "ACTIVE" | "SUSPENDED" | "REMOVED";

export type OrganizationStatus = "ACTIVE" | "SUSPENDED";

export type DiscoverableEnterpriseView = {
    enterpriseCode: number;
    name: string;
    kind: EnterpriseMembershipKind;
};

export type EnterpriseOrganizationDirectoryEntry = {
    organizationCode: number;
    name: string;
    status: OrganizationStatus;
};

export type EnterpriseMemberView = {
    identityId: string;
    email?: string | null;
    kind: EnterpriseMembershipKind;
    status: EnterpriseMembershipStatus;
};

export type EnterpriseSwitchHandoff = {
    organizationCode: number;
    organizationName: string;
};

export type CreateEnterpriseOrganizationRequest = {
    name: string;
    registrationCountry?: string;
    registrationIdType?: string;
    registrationId?: string;
    legalName?: string;
    /** Optional first SYSTEM OWNER; user must have logged in at least once. */
    ownerEmail?: string;
};

export type AddEnterpriseMemberRequest = {
    identityId: string;
    kind: EnterpriseMembershipKind;
};

export type AssignEnterpriseMemberKindRequest = {
    kind: EnterpriseMembershipKind;
};

export type EnterpriseOrganizationLifecycleRequest = {
    reason?: string;
};

export type EnterpriseDailyCount = {
    day: string;
    count: number;
};

export type EnterpriseTopOrganizationRow = {
    organizationCode: number;
    name: string;
    status: OrganizationStatus;
    merchantCount: number;
};

export type EnterpriseDashboardView = {
    enterpriseId: string;
    organizationCountByStatus: Partial<Record<OrganizationStatus, number>>;
    merchantCount: number;
    organizationCreatedTrend?: EnterpriseDailyCount[];
    merchantCreatedTrend?: EnterpriseDailyCount[];
    topOrganizationsByMerchantCount?: EnterpriseTopOrganizationRow[];
};

export type EnterpriseAuditLogItem = {
    eventId: string;
    occurredAt: string;
    requestId?: string;
    traceId?: string;
    actorType: string;
    actorId: string;
    actorEmail?: string;
    actorDisplayName: string;
    actorNameSnapshot?: string;
    action: string;
    actionCategory?: string;
    resourceType?: string;
    resourceId?: string;
    result: string;
    reason?: string;
    metadata?: Record<string, unknown>;
};

export type EnterpriseAuditLogPage = {
    items: EnterpriseAuditLogItem[];
    page: number;
    size: number;
    totalElements: number;
    nextCursor?: string | null;
};

export type EnterpriseAuditListQuery = {
    organizationCode?: number | string;
    action?: string;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
};
