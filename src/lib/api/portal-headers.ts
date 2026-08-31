import { getStoredSelectedMerchantCode } from "@/lib/merchant/selected-merchant-code";
import { getStoredSelectedOrganizationCode } from "@/lib/organization/selected-organization-code";

/** @deprecated Prefer {@link MERCHANT_CODE_HEADER}; kept as transition shim. */
export const SELECTED_GROUP_HEADER = "X-Selected-Group";
export const MERCHANT_CODE_HEADER = "X-Merchant-Code";
export const ORGANIZATION_CODE_HEADER = "X-Organization-Code";

export type PortalHeadersOptions = {
    token?: string;
    /** Business account code — sent as X-Merchant-Code. */
    selectedGroup?: string | null;
    merchantCode?: string | null;
    organizationCode?: string | null;
    contentType?: string | false;
};

export function buildPortalHeaders(options: PortalHeadersOptions = {}): Record<string, string> {
    const headers: Record<string, string> = {};

    if (options.contentType !== false) {
        headers["Content-Type"] = options.contentType ?? "application/json";
    }

    const token = options.token?.trim();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const merchantCode = (options.merchantCode ?? options.selectedGroup)?.trim();
    if (merchantCode) {
        headers[MERCHANT_CODE_HEADER] = merchantCode;
    }

    const organizationCode = options.organizationCode?.trim();
    if (organizationCode) {
        headers[ORGANIZATION_CODE_HEADER] = organizationCode;
    }

    return headers;
}

export function resolveClientSelectedGroup(explicit?: string | null): string | null {
    if (explicit?.trim()) {
        return explicit.trim();
    }
    return getStoredSelectedMerchantCode();
}

export function resolveClientMerchantCode(explicit?: string | null): string | null {
    return resolveClientSelectedGroup(explicit);
}

export function resolveClientOrganizationCode(explicit?: string | null): string | null {
    if (explicit?.trim()) {
        return explicit.trim();
    }
    return getStoredSelectedOrganizationCode();
}
