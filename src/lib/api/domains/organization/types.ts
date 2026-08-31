export type OrganizationRoleType =
    | "OWNER"
    | "ADMIN"
    | "FINANCE"
    | "SUPPORT"
    | "DEVELOPER"
    | "VIEWER";

export type OrganizationRoleKind = "SYSTEM" | "CUSTOM";

/** Mirrors backend OrganizationPermission enum (Active catalog). */
export type OrganizationPermission =
    | "MERCHANT_VIEW"
    | "MERCHANT_CREATE"
    | "MERCHANT_UPDATE"
    | "MERCHANT_CONFIGURE"
    | "USER_VIEW"
    | "USER_CREATE"
    | "USER_DELETE"
    | "ROLE_VIEW"
    | "ROLE_MANAGE"
    | "TEAM_VIEW"
    | "TEAM_CREATE"
    | "TEAM_UPDATE"
    | "TEAM_DELETE"
    | "PAYMENT_VIEW"
    | "PAYMENT_CREATE"
    | "PAYMENT_EXECUTE"
    | "REFUND_APPROVE"
    | "WALLET_VIEW"
    | "WALLET_EXECUTE"
    | "CRYPTO_WALLET_VIEW"
    | "CRYPTO_WALLET_CREATE"
    | "CRYPTO_WALLET_UPDATE"
    | "PAYOUT_VIEW"
    | "PAYOUT_CREATE"
    | "PAYOUT_APPROVE"
    | "SETTLEMENT_VIEW"
    | "LOCATION_VIEW"
    | "LOCATION_CREATE"
    | "LOCATION_UPDATE"
    | "LOCATION_DELETE"
    | "WEBHOOK_VIEW"
    | "WEBHOOK_CREATE"
    | "WEBHOOK_UPDATE"
    | "WEBHOOK_DELETE"
    | "API_KEY_VIEW"
    | "API_KEY_CREATE"
    | "API_KEY_DELETE"
    | "AUDIT_LOG_VIEW"
    | "RISK_VIEW"
    | "RISK_EXECUTE"
    | "RISK_CONFIGURE"
    | "KYC_VIEW"
    | "KYC_UPDATE"
    | "KYC_EXECUTE";

export type OrganizationPermissionDomain =
    | "MERCHANT"
    | "USER"
    | "ROLE"
    | "TEAM"
    | "PAYMENT"
    | "WALLET"
    | "CRYPTO_WALLET"
    | "PAYOUT"
    | "SETTLEMENT"
    | "LOCATION"
    | "WEBHOOK"
    | "API_KEY"
    | "AUDIT_LOG"
    | "RISK"
    | "KYC";

/** Domain order matches backend OrganizationPermission catalog spec. */
export const ORGANIZATION_PERMISSION_DOMAIN_ORDER: OrganizationPermissionDomain[] = [
    "MERCHANT",
    "USER",
    "ROLE",
    "TEAM",
    "PAYMENT",
    "WALLET",
    "CRYPTO_WALLET",
    "PAYOUT",
    "SETTLEMENT",
    "LOCATION",
    "WEBHOOK",
    "API_KEY",
    "AUDIT_LOG",
    "RISK",
    "KYC",
];

export const ORGANIZATION_PERMISSION_DOMAINS: Record<
    OrganizationPermissionDomain,
    OrganizationPermission[]
> = {
    MERCHANT: ["MERCHANT_VIEW", "MERCHANT_CREATE", "MERCHANT_UPDATE", "MERCHANT_CONFIGURE"],
    USER: ["USER_VIEW", "USER_CREATE", "USER_DELETE"],
    ROLE: ["ROLE_VIEW", "ROLE_MANAGE"],
    TEAM: ["TEAM_VIEW", "TEAM_CREATE", "TEAM_UPDATE", "TEAM_DELETE"],
    PAYMENT: ["PAYMENT_VIEW", "PAYMENT_CREATE", "PAYMENT_EXECUTE", "REFUND_APPROVE"],
    WALLET: ["WALLET_VIEW", "WALLET_EXECUTE"],
    CRYPTO_WALLET: ["CRYPTO_WALLET_VIEW", "CRYPTO_WALLET_CREATE", "CRYPTO_WALLET_UPDATE"],
    PAYOUT: ["PAYOUT_VIEW", "PAYOUT_CREATE", "PAYOUT_APPROVE"],
    SETTLEMENT: ["SETTLEMENT_VIEW"],
    LOCATION: ["LOCATION_VIEW", "LOCATION_CREATE", "LOCATION_UPDATE", "LOCATION_DELETE"],
    WEBHOOK: ["WEBHOOK_VIEW", "WEBHOOK_CREATE", "WEBHOOK_UPDATE", "WEBHOOK_DELETE"],
    API_KEY: ["API_KEY_VIEW", "API_KEY_CREATE", "API_KEY_DELETE"],
    AUDIT_LOG: ["AUDIT_LOG_VIEW"],
    RISK: ["RISK_VIEW", "RISK_EXECUTE", "RISK_CONFIGURE"],
    KYC: ["KYC_VIEW", "KYC_UPDATE", "KYC_EXECUTE"],
};

export const ORGANIZATION_PERMISSIONS: OrganizationPermission[] =
    ORGANIZATION_PERMISSION_DOMAIN_ORDER.flatMap(
        (domain) => ORGANIZATION_PERMISSION_DOMAINS[domain],
    );

export type OrganizationRoleSummary = {
    roleId: string;
    kind: OrganizationRoleKind;
    code: string;
    displayName: string;
    permissions: string[];
    description?: string;
};

/** Alias used by scope-aware role editor components. */
export type OrganizationRoleResponse = OrganizationRoleSummary;

export interface CreateOrganizationRoleRequest {
    code: string;
    displayName: string;
    description?: string;
    permissions?: OrganizationPermission[];
}

export interface UpdateOrganizationRoleRequest {
    displayName?: string;
    description?: string;
    permissions?: OrganizationPermission[];
}

export interface OrganizationRoleScopeResponse {
    configurable: boolean;
    unrestricted: boolean;
    resourceCodes: number[];
    orphanCount: number;
}

export interface ReplaceOrganizationRoleScopeRequest {
    resourceType: "MERCHANT";
    resourceCodes: number[];
}

/** Role binding on a member (list members response). */
export type OrganizationMemberRole = {
    roleId: string;
    code: string;
    displayName: string;
    kind: OrganizationRoleKind;
};

export type MembershipStatus = "ACTIVE" | "SUSPENDED" | "REMOVED" | string;

export interface OrganizationSummaryView {
    /** Organization code (Long serialized as decimal string or number). */
    code: number | string;
    name: string;
    /** Current user's system role codes in this org (from /me/organizations). */
    roles: OrganizationRoleType[];
}

export type OrganizationMerchantSettlementMode = "PLATFORM" | "DIRECT";

export type OrganizationMerchantStatus =
    | "DRAFT"
    | "PENDING"
    | "ACTIVE"
    | "SUSPENDED"
    | "CLOSED"
    | string;

/** Business account under the current Organization (Org Scope list). */
export interface OrganizationMerchantView {
    merchantCode: number | string;
    name: string;
    settlementMode: OrganizationMerchantSettlementMode;
    status: OrganizationMerchantStatus;
}

export interface OrganizationMemberView {
    membershipId?: string;
    identityId: string;
    email?: string;
    displayName?: string;
    status: MembershipStatus;
    roles: OrganizationMemberRole[];
    joinedAt?: string;
}

export type TeamRole = "OWNER" | "MANAGER" | "LEAD" | "MEMBER";
export type TeamStatus = "ACTIVE" | "ARCHIVED";

export interface OrganizationInvitationView {
    id: string;
    email: string;
    /** Legacy response field; prefer roleId when present. */
    roleType?: OrganizationRoleType;
    roleId?: string;
    teamId?: string;
    teamRole?: TeamRole;
    status: string;
    expireAt?: string;
    createdAt?: string;
}

export interface CreateOrganizationInvitationRequest {
    email: string;
    roleId: string;
    teamId?: string;
    teamRole?: TeamRole;
}

export interface OrganizationTeamView {
    id: string;
    name: string;
    description?: string;
    status: TeamStatus;
    createdByMembershipId?: string;
    archivedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrganizationTeamMemberView {
    teamId: string;
    membershipId: string;
    teamRole: TeamRole;
    joinedAt?: string;
}

export interface CreateOrganizationTeamRequest {
    name: string;
    description?: string;
    initialOwnerMembershipIds: string[];
}

export interface TeamHasLastOwnerData {
    teams?: Array<{ teamId: string; teamName: string }>;
}

export interface CreateOrganizationMerchantRequest {
    name: string;
    settlementMode: OrganizationMerchantSettlementMode;
}
