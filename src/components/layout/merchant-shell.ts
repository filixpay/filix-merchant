import type { MerchantDetailView } from "@/lib/api";

import {
    getStoredSelectedMerchantCode,
    setStoredSelectedMerchantCode,
} from "@/lib/merchant/selected-merchant-code";

export type MerchantIdentity = "independent" | "sub_merchant";

const MERCHANTS_CACHE_KEY = "dashboardMerchantsCache";

export function readMerchantsCache(): MerchantDetailView[] | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = sessionStorage.getItem(MERCHANTS_CACHE_KEY);
        return raw ? (JSON.parse(raw) as MerchantDetailView[]) : null;
    } catch {
        return null;
    }
}

export function writeMerchantsCache(merchants: MerchantDetailView[]) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(MERCHANTS_CACHE_KEY, JSON.stringify(merchants));
}

export function getStoredSelectedMerchantId(): number | null {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("selectedMerchantId");
    if (!saved) return null;
    const id = parseInt(saved, 10);
    return Number.isNaN(id) ? null : id;
}

export { getStoredSelectedMerchantCode };

export function findSelectedMerchant(
    merchants: MerchantDetailView[],
    selectedId: number | null,
): MerchantDetailView | null {
    if (!merchants.length) return null;
    if (selectedId != null) {
        const found = merchants.find((merchant) => merchant.id === selectedId);
        // #region agent log
        fetch('http://127.0.0.1:7897/ingest/133c483d-e320-4bae-9560-8d2829a55a07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22a5f0'},body:JSON.stringify({sessionId:'22a5f0',runId:'pre-fix',hypothesisId:'H2',location:'merchant-shell.ts:findSelectedMerchant',message:'resolve legacy merchant list selection',data:{selectedId,ids:merchants.map((m)=>({id:m.id,idType:typeof m.id,code:m.code==null?null:String(m.code)})),matched:Boolean(found),fallbackToFirst:!found},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        if (found) return found;
    }
    return merchants[0];
}

export function getMerchantIdentity(merchant: MerchantDetailView): MerchantIdentity {
    return merchant.settlementMode === "PLATFORM" ? "sub_merchant" : "independent";
}

export function persistMerchantSelection(merchant: MerchantDetailView) {
    // #region agent log
    fetch('http://127.0.0.1:7897/ingest/133c483d-e320-4bae-9560-8d2829a55a07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22a5f0'},body:JSON.stringify({sessionId:'22a5f0',runId:'pre-fix',hypothesisId:'H2',location:'merchant-shell.ts:persistMerchantSelection',message:'legacy persistMerchantSelection writing code',data:{id:merchant?.id,idType:typeof merchant?.id,code:merchant?.code==null?null:String(merchant.code),name:merchant?.name},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (merchant?.id != null) {
        localStorage.setItem("selectedMerchantId", String(merchant.id));
    }
    if (merchant?.code != null && String(merchant.code).trim() !== "") {
        setStoredSelectedMerchantCode(merchant.code);
    }
    localStorage.setItem("merchantIdentity", getMerchantIdentity(merchant));
}

export function getInitialActiveMerchant(): MerchantDetailView | null {
    const cached = readMerchantsCache();
    if (!cached?.length) return null;
    return findSelectedMerchant(cached, getStoredSelectedMerchantId());
}

export function readSidebarCollapsed(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebarCollapsed") === "true";
}

export function syncSidebarCollapsedDom(collapsed: boolean) {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.sidebarCollapsed = collapsed ? "1" : "0";
}
