import type { DiscoverableEnterpriseView } from "@/lib/api";
import {
    getStoredSelectedEnterpriseCode,
    setStoredSelectedEnterpriseCode,
} from "@/lib/enterprise/selected-enterprise-code";

const ENTERPRISES_CACHE_KEY = "dashboardEnterprisesCache";

export function enterpriseCodeToString(code: number | string): string {
    return String(code);
}

export function readEnterprisesCache(): DiscoverableEnterpriseView[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(ENTERPRISES_CACHE_KEY);
        return raw ? (JSON.parse(raw) as DiscoverableEnterpriseView[]) : null;
    } catch {
        return null;
    }
}

export function writeEnterprisesCache(enterprises: DiscoverableEnterpriseView[]) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(ENTERPRISES_CACHE_KEY, JSON.stringify(enterprises));
}

export function findSelectedEnterprise(
    enterprises: DiscoverableEnterpriseView[],
    selectedCode: string | null,
): DiscoverableEnterpriseView | null {
    if (!enterprises.length) return null;
    if (selectedCode) {
        const found = enterprises.find(
            (item) => enterpriseCodeToString(item.enterpriseCode) === selectedCode,
        );
        if (found) return found;
    }
    return null;
}

export function persistEnterpriseSelection(enterprise: DiscoverableEnterpriseView) {
    setStoredSelectedEnterpriseCode(enterprise.enterpriseCode);
}

export function getInitialActiveEnterprise(): DiscoverableEnterpriseView | null {
    const cached = readEnterprisesCache();
    if (!cached?.length) return null;
    return findSelectedEnterprise(cached, getStoredSelectedEnterpriseCode());
}

export { getStoredSelectedEnterpriseCode };
