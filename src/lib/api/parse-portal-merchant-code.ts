export function parsePortalMerchantCode(body: Record<string, unknown>): string | undefined {
    const raw = body.merchantCode ?? body.merchant_code ?? body.selectedGroup ?? body.selected_group;
    if (typeof raw !== "string" && typeof raw !== "number") {
        return undefined;
    }

    const merchantCode = String(raw).trim();
    if (!merchantCode || !/^\d+$/.test(merchantCode)) {
        return undefined;
    }

    return merchantCode;
}
