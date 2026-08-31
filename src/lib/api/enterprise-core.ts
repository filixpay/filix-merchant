import { API_BASE_URL } from "../api-config";
import { ApiError, type ApiResponse } from "./core";
import {
    buildEnterpriseHeaders,
    resolveClientEnterpriseCode,
} from "./enterprise-headers";

export type EnterpriseRequestOptions = RequestInit & {
    token?: string;
    /** When true (default for scoped routes), attach X-Enterprise-Code from storage or explicit override. */
    enterpriseCode?: string | null;
    includeEnterpriseCode?: boolean;
};

/**
 * Enterprise Portal transport — MUST NOT attach Merchant org/merchant headers (E5).
 */
export async function enterpriseRequest<T>(
    path: string,
    options: EnterpriseRequestOptions = {},
): Promise<T> {
    const { token, enterpriseCode, includeEnterpriseCode = true, ...fetchOptions } = options;
    const url = `${API_BASE_URL}${path}`;

    const resolvedEnterpriseCode =
        includeEnterpriseCode ? resolveClientEnterpriseCode(enterpriseCode) : null;

    const response = await fetch(url, {
        ...fetchOptions,
        headers: {
            ...buildEnterpriseHeaders({
                token,
                enterpriseCode: resolvedEnterpriseCode,
                contentType: fetchOptions.body ? "application/json" : undefined,
            }),
            ...(fetchOptions.headers as Record<string, string> | undefined),
        },
    });

    let data: ApiResponse<T>;

    try {
        data = (await response.json()) as ApiResponse<T>;
    } catch (error) {
        if (!response.ok) {
            throw new ApiError(`Request failed with status ${response.status}`, response.status);
        }
        throw error;
    }

    if (!response.ok || data.success === false || (data.code !== 0 && data.code !== "SUCCESS")) {
        throw new ApiError(
            data.message || `Request failed with status ${response.status}`,
            response.status,
            data.code,
            data.data,
        );
    }

    return data.data;
}
