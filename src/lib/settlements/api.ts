import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import type { PagedResponse } from "@/lib/api/types";

export type MerchantSettlementReconStatus = "PENDING" | "MATCHED" | "EXCEPTION";

export interface SettlementListItem {
  settlementId: string;
  moneyInRef: string;
  paymentId: string | null;
  asset: string;
  gross: string | number;
  fee: string | number;
  net: string | number;
  releasedAt: string;
  reconStatus: MerchantSettlementReconStatus;
  provider: string | null;
}

export interface ProviderSettlementView {
  provider: string | null;
  providerReference: string | null;
  settlementDate: string | null;
  expectedNet: string | number | null;
  actualNet: string | number | null;
  difference: string | number | null;
}

export interface SettlementTimelineEvent {
  kind: string;
  occurredAt: string;
}

export interface SettlementDetail {
  settlementId: string;
  asset: string;
  net: string | number;
  reconStatus: MerchantSettlementReconStatus;
  gross: string | number;
  fee: string | number;
  settlement: {
    moneyInRef: string;
    paymentId: string | null;
    releaseRef: string;
    releasedAt: string;
    asset: string;
    ledgerReleaseReference: string;
  };
  providerSettlement: ProviderSettlementView;
  reconciliation: {
    reconStatus: MerchantSettlementReconStatus;
    difference: string | number | null;
  };
  timeline: SettlementTimelineEvent[];
}

export interface SettlementQuery {
  reconStatus?: MerchantSettlementReconStatus[];
  asset?: string;
  releasedFrom?: string;
  releasedTo?: string;
  paymentId?: string;
  page?: number;
  size?: number;
}

export function buildListUrl(params: SettlementQuery): string {
  const qs = new URLSearchParams();
  const page = params.page ?? 0;
  const size = params.size ?? 20;
  qs.set("page", String(page));
  qs.set("size", String(size));
  for (const status of params.reconStatus ?? []) {
    qs.append("reconStatus", status);
  }
  if (params.asset) qs.set("asset", params.asset);
  if (params.releasedFrom) qs.set("releasedFrom", params.releasedFrom);
  if (params.releasedTo) qs.set("releasedTo", params.releasedTo);
  if (params.paymentId) qs.set("paymentId", params.paymentId);
  const query = qs.toString();
  return `${ENDPOINTS.PORTAL.MONEY_SETTLEMENTS}${query ? `?${query}` : ""}`;
}

/** Half-open [from, to): day start inclusive, next-day start exclusive (UTC). */
export function dayRangeToHalfOpenUtc(fromDay: string | null, toDay: string | null): {
  from?: string;
  to?: string;
} {
  const out: { from?: string; to?: string } = {};
  if (fromDay) {
    out.from = `${fromDay}T00:00:00.000Z`;
  }
  if (toDay) {
    const next = new Date(`${toDay}T00:00:00.000Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    out.to = next.toISOString();
  }
  return out;
}

export const settlementsApi = {
  list: (params: SettlementQuery, token: string): Promise<PagedResponse<SettlementListItem>> =>
    request<PagedResponse<SettlementListItem>>(buildListUrl(params), {
      headers: authHeaders(token),
    }),

  get: (settlementId: string, token: string) =>
    request<SettlementDetail>(ENDPOINTS.PORTAL.MONEY_SETTLEMENT(settlementId), {
      headers: authHeaders(token),
    }),
};
