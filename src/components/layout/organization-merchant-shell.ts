import type { OrganizationMerchantView } from "@/lib/api";
import {
    getStoredSelectedMerchantCode,
    setStoredSelectedMerchantCode,
} from "@/lib/merchant/selected-merchant-code";
import type { MerchantIdentity } from "./merchant-shell";

const ORG_MERCHANTS_CACHE_KEY = "dashboardOrganizationMerchantsCache";
const ORG_MERCHANTS_ORG_KEY = "dashboardOrganizationMerchantsOrgCode";

export function merchantCodeToString(code: number | string): string {
    return String(code);
}

export function readOrganizationMerchantsCache(
    organizationCode: string | null,
): OrganizationMerchantView[] | null {
    if (typeof window === "undefined" || !organizationCode) return null;
    try {
        const cachedOrg = sessionStorage.getItem(ORG_MERCHANTS_ORG_KEY);
        if (cachedOrg !== organizationCode) return null;
        const raw = sessionStorage.getItem(ORG_MERCHANTS_CACHE_KEY);
        return raw ? (JSON.parse(raw) as OrganizationMerchantView[]) : null;
    } catch {
        return null;
    }
}

export function writeOrganizationMerchantsCache(
    organizationCode: string,
    merchants: OrganizationMerchantView[],
) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(ORG_MERCHANTS_ORG_KEY, organizationCode);
    sessionStorage.setItem(ORG_MERCHANTS_CACHE_KEY, JSON.stringify(merchants));
}

export function clearOrganizationMerchantsCache() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(ORG_MERCHANTS_CACHE_KEY);
    sessionStorage.removeItem(ORG_MERCHANTS_ORG_KEY);
}

export function findSelectedOrganizationMerchant(
    merchants: OrganizationMerchantView[],
    selectedCode: string | null,
): OrganizationMerchantView | null {
    if (!merchants.length) return null;
    if (selectedCode) {
        const found = merchants.find(
            (merchant) => merchantCodeToString(merchant.merchantCode) === selectedCode,
        );
        if (found) return found;
    }
    return merchants[0];
}

export function getMerchantIdentityFromSettlementMode(
    settlementMode: OrganizationMerchantView["settlementMode"],
): MerchantIdentity {
    return settlementMode === "PLATFORM" ? "sub_merchant" : "independent";
}

export function persistOrganizationMerchantSelection(merchant: OrganizationMerchantView) {
    setStoredSelectedMerchantCode(merchant.merchantCode);
    localStorage.setItem(
        "merchantIdentity",
        getMerchantIdentityFromSettlementMode(merchant.settlementMode),
    );
}

export function getInitialActiveOrganizationMerchant(
    organizationCode: string | null,
): OrganizationMerchantView | null {
    const cached = readOrganizationMerchantsCache(organizationCode);
    if (!cached?.length) return null;
    return findSelectedOrganizationMerchant(cached, getStoredSelectedMerchantCode());
}

export { getStoredSelectedMerchantCode };
