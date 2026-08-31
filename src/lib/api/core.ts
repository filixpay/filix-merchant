import { API_BASE_URL } from "../api-config";
import {
  buildPortalHeaders,
  resolveClientMerchantCode,
  resolveClientOrganizationCode,
} from "./portal-headers";

export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number | string;
  message: string;
  timestamp: string | number;
  data: T;
}

export class ApiError extends Error {
  status: number;
  code?: number | string;
  data?: unknown;

  constructor(message: string, status: number, code?: number | string, data?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.data = data;
    this.name = "ApiError";
  }
}

export function authHeaders(token: string): HeadersInit {
  // Runtime guard only — catches callers that bypass TypeScript (e.g. `as any`).
  // Primary protection is required `token: string` on pilot API signatures.
  // Use optional chaining so null/undefined also yields MISSING_ACCESS_TOKEN, not TypeError.
  if (!token?.trim()) {
    throw new ApiError("Missing access token", 401, "MISSING_ACCESS_TOKEN");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const merchantCode = resolveClientMerchantCode();
  const organizationCode = resolveClientOrganizationCode();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...buildPortalHeaders({ merchantCode, organizationCode }),
      ...options.headers,
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
