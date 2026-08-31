import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { ApiError, authHeaders, request } from "@/lib/api/core";
import {
  buildPortalHeaders,
  resolveClientMerchantCode,
  resolveClientOrganizationCode,
} from "@/lib/api/portal-headers";
import type { PagedResponse } from "@/lib/api/types";

export type SettlementPeriodKind = "DAY" | "WEEK" | "MONTH";
export type PeriodState = "OPEN" | "CLOSED";
export type CoverageState = "OK" | "PARTIAL_COVERAGE" | "INCONSISTENT";

export interface SettlementStatementSummary {
  statementKey: string;
  assetCode: string;
  periodKind: SettlementPeriodKind;
  periodKey: string;
  startInstant?: string;
  endInstant?: string;
  effectiveEnd?: string;
  asOf?: string;
  periodState: PeriodState;
  coverageState: CoverageState;
  grossAmount: string | number;
  feeAmount: string | number;
  adjustmentAmount: string | number;
  settlementNet: string | number;
  releasedAmount: string | number;
  payoutAmount: string | number;
  timezone: string;
  timezoneSource: string;
}

export interface SettlementStatementEventRow {
  businessRef: string;
  grossAmount: string | number;
  feeAmount: string | number;
  adjustmentAmount: string | number;
  releasedAmount: string | number;
  payoutAmount: string | number;
  journalIds: string[];
}

export interface StatementJournalEntryLine {
  accountId: string;
  accountDefinitionCode: string;
  bucket: string;
  ownerType: string;
  ownerId: string;
  direction: string;
  amount: string | number;
}

export interface StatementJournalFact {
  journalId: string;
  effectiveAt: string;
  businessType: { domain?: string; action?: string } | string;
  assetCode: string;
  merchantOwner?: { ownerType?: string; ownerId?: string } | null;
  entries: StatementJournalEntryLine[];
  businessRef?: string | null;
}

export interface SettlementStatementDiagnostic {
  journalId: string;
  kind: "INCONSISTENT" | "UNCLASSIFIED" | string;
  businessType: { domain?: string; action?: string } | string;
  businessRef?: string | null;
  reason?: string | null;
}

export interface SettlementStatementDetail {
  summary: SettlementStatementSummary;
  events: SettlementStatementEventRow[];
  journals: StatementJournalFact[];
  diagnostics: {
    conflicts: SettlementStatementDiagnostic[];
    unclassified: SettlementStatementDiagnostic[];
  };
}

export interface SettlementStatementQuery {
  assetCode?: string;
  periodKind: SettlementPeriodKind;
  from: string;
  to: string;
  pageNumber?: number;
  pageSize?: number;
}

export function buildSettlementStatementListUrl(params: SettlementStatementQuery): string {
  const qs = new URLSearchParams();
  if (params.assetCode) {
    qs.set("assetCode", params.assetCode);
  }
  qs.set("periodKind", params.periodKind);
  qs.set("from", params.from);
  qs.set("to", params.to);
  qs.set("pageNumber", String(params.pageNumber ?? 0));
  qs.set("pageSize", String(params.pageSize ?? 20));
  return `${ENDPOINTS.PORTAL.MONEY_SETTLEMENT_STATEMENTS}?${qs.toString()}`;
}

export function buildSettlementStatementDetailPath(statementKey: string): string {
  return ENDPOINTS.PORTAL.MONEY_SETTLEMENT_STATEMENT(statementKey);
}

export function buildSettlementStatementDownloadPath(statementKey: string): string {
  return ENDPOINTS.PORTAL.MONEY_SETTLEMENT_STATEMENT_DOWNLOAD(statementKey);
}

export function isPeriodNotStartedError(error: unknown): boolean {
  return error instanceof ApiError && error.code === "PERIOD_NOT_STARTED";
}

async function downloadBlob(path: string, token: string): Promise<Blob> {
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
    let data: unknown;
    try {
      const body = (await response.json()) as {
        message?: string;
        code?: string | number;
        data?: unknown;
      };
      if (body.message) message = body.message;
      if (body.code != null) code = body.code;
      data = body.data;
    } catch {
      // binary or empty error bodies
    }
    throw new ApiError(message, response.status, code, data);
  }

  return response.blob();
}

export const settlementStatementsApi = {
  list: (
    params: SettlementStatementQuery,
    token: string,
  ): Promise<PagedResponse<SettlementStatementSummary>> =>
    request<PagedResponse<SettlementStatementSummary>>(buildSettlementStatementListUrl(params), {
      headers: authHeaders(token),
    }),

  get: (statementKey: string, token: string) =>
    request<SettlementStatementDetail>(buildSettlementStatementDetailPath(statementKey), {
      headers: authHeaders(token),
    }),

  downloadXlsx: (statementKey: string, token: string) =>
    downloadBlob(buildSettlementStatementDownloadPath(statementKey), token),
};
