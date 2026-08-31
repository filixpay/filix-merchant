import type { OrganizationRoleType } from "@/lib/api/domains/organization/types";

const INVITE_ROLES: OrganizationRoleType[] = ["OWNER", "ADMIN"];
const REMOVE_ROLES: OrganizationRoleType[] = ["OWNER", "ADMIN"];
const CREATE_MERCHANT_ROLES: OrganizationRoleType[] = ["OWNER", "ADMIN"];
const VIEW_MEMBERS_ROLES: OrganizationRoleType[] = ["OWNER", "ADMIN", "VIEWER", "SUPPORT"];
/** Backend ROLE_MANAGE — system OWNER/ADMIN today. */
const ROLE_MANAGE_ROLES: OrganizationRoleType[] = ["OWNER", "ADMIN"];

function hasAnyRole(roles: OrganizationRoleType[], allowed: OrganizationRoleType[]): boolean {
    return roles.some((role) => allowed.includes(role));
}

export function organizationCanViewMembers(roles: OrganizationRoleType[]): boolean {
    return hasAnyRole(roles, VIEW_MEMBERS_ROLES);
}

export function organizationCanInvite(roles: OrganizationRoleType[]): boolean {
    return hasAnyRole(roles, INVITE_ROLES);
}

export function organizationCanRemoveMember(roles: OrganizationRoleType[]): boolean {
    return hasAnyRole(roles, REMOVE_ROLES);
}

/** Change member role requires ROLE_MANAGE (OWNER/ADMIN system codes). */
export function organizationCanChangeRole(roles: OrganizationRoleType[]): boolean {
    return hasAnyRole(roles, ROLE_MANAGE_ROLES);
}

/** Custom role CRUD requires ROLE_MANAGE (OWNER/ADMIN system codes). */
export function organizationCanManageRoles(roles: OrganizationRoleType[]): boolean {
    return hasAnyRole(roles, ROLE_MANAGE_ROLES);
}

export function organizationCanCreateMerchant(roles: OrganizationRoleType[]): boolean {
    return hasAnyRole(roles, CREATE_MERCHANT_ROLES);
}

/** Create Team is Organization Administration (OWNER/ADMIN). */
export function organizationCanCreateTeam(roles: OrganizationRoleType[]): boolean {
    return hasAnyRole(roles, INVITE_ROLES);
}

/** Org OWNER may Override Team governance; ADMIN may view but not write. */
export function organizationIsOwner(roles: OrganizationRoleType[]): boolean {
    return roles.includes("OWNER");
}

export function organizationIsAdminOnly(roles: OrganizationRoleType[]): boolean {
    return roles.includes("ADMIN") && !roles.includes("OWNER");
}

/** System OWNER role code — used to guard remove / invite filters. */
export const SYSTEM_OWNER_ROLE_CODE = "OWNER";
