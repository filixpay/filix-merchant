import { notifyMerchantCodeChanged } from "./merchant-code-events";

const STORAGE_KEY = "selectedMerchantCode";

export function getStoredSelectedMerchantCode(): string | null {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved?.trim() ? saved.trim() : null;
}

export function setStoredSelectedMerchantCode(code: string | number): void {
    if (typeof window === "undefined") return;
    const prev = localStorage.getItem(STORAGE_KEY);
    const next = String(code);
    // #region agent log
    fetch('http://127.0.0.1:7897/ingest/133c483d-e320-4bae-9560-8d2829a55a07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22a5f0'},body:JSON.stringify({sessionId:'22a5f0',runId:'pre-fix',hypothesisId:'H2_H4',location:'selected-merchant-code.ts:setStored',message:'persist selectedMerchantCode',data:{prev,next,changed:prev!==next,stack:(new Error()).stack?.split('\n').slice(1,5)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    localStorage.setItem(STORAGE_KEY, next);
    notifyMerchantCodeChanged(code);
}

export function clearStoredSelectedMerchantCode(): void {
    if (typeof window === "undefined") return;
    const prev = localStorage.getItem(STORAGE_KEY);
    // #region agent log
    fetch('http://127.0.0.1:7897/ingest/133c483d-e320-4bae-9560-8d2829a55a07',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22a5f0'},body:JSON.stringify({sessionId:'22a5f0',runId:'pre-fix',hypothesisId:'H3_H5',location:'selected-merchant-code.ts:clearStored',message:'clear selectedMerchantCode',data:{prev,stack:(new Error()).stack?.split('\n').slice(1,5)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    localStorage.removeItem(STORAGE_KEY);
    notifyMerchantCodeChanged(null);
}
