import { getStoredSelectedMerchantCode } from "@/lib/merchant/selected-merchant-code";

export function withSelectedMerchantCode<T extends Record<string, unknown>>(
    body: T = {} as T,
): T & { merchantCode?: string } {
    const merchantCode = getStoredSelectedMerchantCode();
    return merchantCode ? { ...body, merchantCode } : body;
}
