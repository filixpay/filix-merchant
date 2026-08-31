import type { OrganizationSummaryView } from "@/lib/api";
import {
    getStoredSelectedOrganizationCode,
    setStoredSelectedOrganizationCode,
} from "@/lib/organization/selected-organization-code";

const ORGANIZATIONS_CACHE_KEY = "dashboardOrganizationsCache";

export function organizationCodeToString(code: number | string): string {
    return String(code);
}

export function readOrganizationsCache(): OrganizationSummaryView[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(ORGANIZATIONS_CACHE_KEY);
        return raw ? (JSON.parse(raw) as OrganizationSummaryView[]) : null;
    } catch {
        return null;
    }
}

export function writeOrganizationsCache(organizations: OrganizationSummaryView[]) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(ORGANIZATIONS_CACHE_KEY, JSON.stringify(organizations));
}

export function findSelectedOrganization(
    organizations: OrganizationSummaryView[],
    selectedCode: string | null,
): OrganizationSummaryView | null {
    if (!organizations.length) return null;
    if (selectedCode) {
        const found = organizations.find(
            (org) => organizationCodeToString(org.code) === selectedCode,
        );
        if (found) return found;
    }
    return organizations[0];
}

export function persistOrganizationSelection(organization: OrganizationSummaryView) {
    setStoredSelectedOrganizationCode(organization.code);
}

export function getInitialActiveOrganization(): OrganizationSummaryView | null {
    const cached = readOrganizationsCache();
    if (!cached?.length) return null;
    return findSelectedOrganization(cached, getStoredSelectedOrganizationCode());
}

export { getStoredSelectedOrganizationCode };
