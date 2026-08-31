import { getStoredSelectedEnterpriseCode } from "@/lib/enterprise/selected-enterprise-code";

export const ENTERPRISE_CODE_HEADER = "X-Enterprise-Code";

export type EnterpriseHeadersOptions = {
    token?: string;
    enterpriseCode?: string | null;
    contentType?: string | false;
};

export function buildEnterpriseHeaders(options: EnterpriseHeadersOptions = {}): Record<string, string> {
    const headers: Record<string, string> = {};

    if (options.contentType !== false) {
        headers["Content-Type"] = options.contentType ?? "application/json";
    }

    const token = options.token?.trim();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const enterpriseCode = options.enterpriseCode?.trim();
    if (enterpriseCode) {
        headers[ENTERPRISE_CODE_HEADER] = enterpriseCode;
    }

    return headers;
}

export function resolveClientEnterpriseCode(explicit?: string | null): string | null {
    if (explicit?.trim()) {
        return explicit.trim();
    }
    return getStoredSelectedEnterpriseCode();
}
