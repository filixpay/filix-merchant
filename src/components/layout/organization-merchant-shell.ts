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
        // #region agent log
        fetch('http://127.0.0.1:7897/ingest/133c483d-e320-4bae-9560-8d2829a55a07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22a5f0'},body:JSON.stringify({sessionId:'22a5f0',runId:'pre-fix',hypothesisId:'H1_H4',location:'organization-merchant-shell.ts:findSelectedOrganizationMerchant',message:'resolve org merchant selection',data:{selectedCode,listCodes:merchants.map((m)=>({code:merchantCodeToString(m.merchantCode),codeType:typeof m.merchantCode,name:m.name})),matched:Boolean(found),fallbackToFirst:!found},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        if (found) return found;
    } else {
        // #region agent log
        fetch('http://127.0.0.1:7897/ingest/133c483d-e320-4bae-9560-8d2829a55a07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22a5f0'},body:JSON.stringify({sessionId:'22a5f0',runId:'pre-fix',hypothesisId:'H3',location:'organization-merchant-shell.ts:findSelectedOrganizationMerchant',message:'no selectedCode — fallback to first',data:{listCodes:merchants.map((m)=>merchantCodeToString(m.merchantCode))},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
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
