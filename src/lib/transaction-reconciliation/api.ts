import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders, request } from "@/lib/api/core";
import {
  buildPortalHeaders,
  resolveClientMerchantCode,
  resolveClientOrganizationCode,
} from "@/lib/api/portal-headers";
import type { PagedResponse } from "@/lib/api/types";

export type MerchantTransactionReconStatus =
  | "MATCHED"
  | "MISMATCH"
  | "RECONCILIATION_PENDING"
  | "NOT_RECONCILED";

export type TransactionReconScope = "default" | "allTransactions";

export interface TransactionReconItem {
  reconciliationItemId: string;
  paymentId: string;
  orderId: string;
  merchantId: string;
  channelCode: string;
  reconciliationLevel: string;
  reconciliationStatus: MerchantTransactionReconStatus;
  mismatchType: string | null;
  providerTransactionId: string | null;
  providerOrderId: string | null;
  bizDate: string;
}

export interface TransactionReconDetail {
  summary: TransactionReconItem;
  providerAmount: string | number | null;
  providerStatus: string | null;
  providerCurrency: string | null;
  localAmount: string | number | null;
  localStatus: string | null;
}

export interface TransactionReconListResponse {
  items: TransactionReconItem[];
  noReconData: boolean;
  bizDateRange: { from: string; to: string };
  total: number;
  page: number;
  size: number;
}

export interface TransactionReconQuery {
  from: string;
  to: string;
  channelCode?: string;
  scope?: TransactionReconScope;
  page?: number;
  size?: number;
}

export function buildListUrl(params: TransactionReconQuery): string {
  const qs = new URLSearchParams();
  qs.set("from", params.from);
  qs.set("to", params.to);
  if (params.channelCode) {
    qs.set("channelCode", params.channelCode);
  }
  qs.set("scope", params.scope ?? "default");
  qs.set("page", String(params.page ?? 0));
  qs.set("size", String(params.size ?? 20));
  return `${ENDPOINTS.PORTAL.MONEY_TRANSACTION_RECON}?${qs.toString()}`;
}

export function buildExportUrl(params: Omit<TransactionReconQuery, "page" | "size">): string {
  const qs = new URLSearchParams();
  qs.set("from", params.from);
  qs.set("to", params.to);
  if (params.channelCode) {
    qs.set("channelCode", params.channelCode);
  }
  qs.set("scope", params.scope ?? "default");
  return `${ENDPOINTS.PORTAL.MONEY_TRANSACTION_RECON_EXPORT}?${qs.toString()}`;
}

async function downloadCsv(path: string, token: string): Promise<Blob> {
  const merchantCode = resolveClientMerchantCode();
  const organizationCode = resolveClientOrganizationCode();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...buildPortalHeaders({ merchantCode, organizationCode }),
      ...authHeaders(token),
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    let code: string | number | undefined = response.status;
    try {
      const body = (await response.json()) as { message?: string; code?: string | number };
      if (body.message) message = body.message;
      if (body.code != null) code = body.code;
    } catch {
      // non-json error body
    }
    throw new ApiError(message, response.status, code);
  }

  return response.blob();
}

export const transactionReconApi = {
  list: async (
    params: TransactionReconQuery,
    token: string,
  ): Promise<TransactionReconListResponse> =>
    request<TransactionReconListResponse>(buildListUrl(params), {
      headers: authHeaders(token),
    }),

  listPaged: async (
    params: TransactionReconQuery,
    token: string,
  ): Promise<PagedResponse<TransactionReconItem>> => {
    const response = await transactionReconApi.list(params, token);
    return {
      data: response.items,
      total: response.total,
    };
  },

  get: (reconciliationItemId: string, token: string) =>
    request<TransactionReconDetail>(
      ENDPOINTS.PORTAL.MONEY_TRANSACTION_RECON_ITEM(reconciliationItemId),
      { headers: authHeaders(token) },
    ),

  exportCsv: (params: Omit<TransactionReconQuery, "page" | "size">, token: string) =>
    downloadCsv(buildExportUrl(params), token),
};
