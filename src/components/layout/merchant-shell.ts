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

export function getStoredSelectedMerchantId(): string | number | null {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("selectedMerchantId")?.trim();
    if (!saved) return null;
    // API merchant ids may be UUID strings; parseInt("01a0…") === 1 and breaks matching.
    if (/^\d+$/.test(saved)) {
        const asNumber = Number(saved);
        return Number.isSafeInteger(asNumber) ? asNumber : saved;
    }
    return saved;
}

export { getStoredSelectedMerchantCode };

export function findSelectedMerchant(
    merchants: MerchantDetailView[],
    selectedId: string | number | null,
): MerchantDetailView | null {
    if (!merchants.length) return null;
    if (selectedId != null && selectedId !== "") {
        const selectedKey = String(selectedId);
        const found = merchants.find((merchant) => String(merchant.id) === selectedKey);
        // #region agent log
        fetch('http://127.0.0.1:7897/ingest/133c483d-e320-4bae-9560-8d2829a55a07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22a5f0'},body:JSON.stringify({sessionId:'22a5f0',runId:'post-fix',hypothesisId:'H2',location:'merchant-shell.ts:findSelectedMerchant',message:'resolve legacy merchant list selection',data:{selectedId:selectedKey,ids:merchants.map((m)=>({id:m.id,idType:typeof m.id,code:m.code==null?null:String(m.code)})),matched:Boolean(found),fallbackToFirst:false},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        // Explicit selection that is missing must not fall back to merchants[0]:
        // that path overwrote selectedMerchantCode and reset the org business account.
        return found ?? null;
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
