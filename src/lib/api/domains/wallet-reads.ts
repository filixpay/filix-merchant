import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";
import type { PagedResponse } from "../types";

export type WalletMovementDirection = "IN" | "OUT";

export type WalletPortalBucket = "AVAILABLE" | "PENDING";

export interface WalletOverviewView {
  assetCode: string;
  available: number;
  pending: number;
  frozen: number;
  frozenSupported: boolean;
  settlementRelatedAmount: number;
}

export interface WalletCapabilityView {
  canView: boolean;
  walletEnabled: boolean;
}

/** @deprecated Fat op shape removed from merchant gate — use WalletAssetCapabilityView */
export interface WalletOperationCapability {
  enabled: boolean;
  reason: string;
  requiresPermission: boolean;
  requiresReview: boolean;
  temporarilyUnavailable: boolean;
}

/** Wave 2 Asset Capability — advisory projection (not Intent auth). */
/** Policy v2 — closed Product reason vocabulary (advisory; not WalletAssetStatus). */
export type WalletCapabilityReasonCode =
  | "RUNTIME_NOT_READY"
  | "NOT_SUPPORTED"
  | "CONFIG_DISABLED"
  | "ASSET_NOT_PROVISIONED"
  | "ASSET_INITIALIZING"
  | "ASSET_SUSPENDED"
  | "ASSET_DISABLED"
  | "ASSET_CLOSED";

export interface WalletAssetCapabilityOperationView {
  enabled: boolean;
  reasonCode: WalletCapabilityReasonCode | null;
}

const KNOWN_CAPABILITY_REASONS = new Set<string>([
  "RUNTIME_NOT_READY",
  "NOT_SUPPORTED",
  "CONFIG_DISABLED",
  "ASSET_NOT_PROVISIONED",
  "ASSET_INITIALIZING",
  "ASSET_SUSPENDED",
  "ASSET_DISABLED",
  "ASSET_CLOSED",
]);

/** Forward-compat: unknown server codes → null (no crash; enum stays closed). */
export function parseCapabilityReasonCode(raw: unknown): WalletCapabilityReasonCode | null {
  if (typeof raw !== "string") return null;
  return KNOWN_CAPABILITY_REASONS.has(raw) ? (raw as WalletCapabilityReasonCode) : null;
}

export interface WalletAssetCapabilityView {
  assetCode: string;
  supported: boolean;
  deposit: WalletAssetCapabilityOperationView;
  withdrawal: WalletAssetCapabilityOperationView;
  transfer: WalletAssetCapabilityOperationView;
}

export interface WalletMovementView {
  movementId: string;
  occurredAt: string;
  movementType: string;
  direction: WalletMovementDirection;
  amount: string | number;
  assetCode: string;
  bucket: string;
  referenceType: string;
  referenceId: string;
  description?: string | null;
  status?: string | null;
}

export interface WalletMovementRow extends Omit<WalletMovementView, "amount"> {
  amount: number;
  signedAmountPrefix: "+" | "-";
}

export function toWalletMovementRow(view: WalletMovementView): WalletMovementRow {
  const amount = typeof view.amount === "number" ? view.amount : Number(view.amount);
  return {
    movementId: view.movementId,
    occurredAt: view.occurredAt,
    movementType: view.movementType,
    direction: view.direction,
    amount: Number.isFinite(amount) ? Math.abs(amount) : 0,
    assetCode: view.assetCode,
    bucket: view.bucket,
    referenceType: view.referenceType,
    referenceId: view.referenceId,
    description: view.description ?? null,
    status: view.status ?? null,
    signedAmountPrefix: view.direction === "OUT" ? "-" : "+",
  };
}

export interface WalletMovementsQuery {
  bucket: WalletPortalBucket;
  assetCode: string;
  page?: number;
  size?: number;
}

export interface WalletAccountsResponse {
  accounts: WalletOverviewView[];
}

export interface WalletNetworkView {
  network: string;
  enabled: boolean;
  collectionAddressCount: number;
}

export interface WalletNetworksResponse {
  assetCode: string;
  networks: WalletNetworkView[];
}

export interface WalletAddressOperationsView {
  copy: boolean;
  qr: boolean;
}

export interface WalletAddressView {
  addressId: string;
  network: string;
  address: string;
  purpose: string;
  custodyType: string;
  status: string;
  label: string | null;
  createdAt: string | null;
  ledgerBindStatus: string;
  operations: WalletAddressOperationsView;
}

export interface WalletAddressesResponse {
  assetCode: string;
  network: string;
  addresses: WalletAddressView[];
}

/** Wave 3 / W5 — closed Identity Summary DTO (assetStatus enum name string or null). */
export type WalletAssetStatusName =
  | "INITIALIZING"
  | "ACTIVE"
  | "SUSPENDED"
  | "DISABLED"
  | "CLOSED";

export interface WalletIdentitySummaryView {
  assetCode: string;
  assetStatus?: WalletAssetStatusName | string | null;
  /** ALWAYS an array — never null; empty means no network footprint. */
  networks: WalletNetworkView[];
}

/** Normalize Summary payload so `networks` is never null/undefined. */
export function normalizeIdentitySummary(
  raw: Pick<WalletIdentitySummaryView, "assetCode"> & {
    assetStatus?: WalletAssetStatusName | string | null;
    networks?: WalletNetworkView[] | null;
  },
): WalletIdentitySummaryView {
  return {
    assetCode: raw.assetCode,
    assetStatus: raw.assetStatus ?? null,
    networks: Array.isArray(raw.networks) ? raw.networks : [],
  };
}

export function reduceIdentityNetworkCount(summary: WalletIdentitySummaryView): number {
  return summary.networks.length;
}

export function reduceIdentityAddressCount(summary: WalletIdentitySummaryView): number {
  return summary.networks.reduce((sum, n) => sum + (n.collectionAddressCount ?? 0), 0);
}

/**
 * Best-effort Summary fetch for displayed assets.
 * Failures/timeouts map to `null` and MUST NOT hide money overview cards.
 */
export async function loadIdentitySummariesBestEffort(
  assetCodes: string[],
  fetchSummary: (assetCode: string) => Promise<WalletIdentitySummaryView>,
): Promise<Record<string, WalletIdentitySummaryView | null>> {
  const entries = await Promise.all(
    assetCodes.map(async (assetCode) => {
      try {
        const summary = await fetchSummary(assetCode);
        return [assetCode, normalizeIdentitySummary(summary)] as const;
      } catch {
        return [assetCode, null] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}

export const walletReadsApi = {
  getAccounts: (token: string) =>
    request<WalletAccountsResponse>(ENDPOINTS.PORTAL.WALLET_ACCOUNTS, {
      headers: authHeaders(token),
    }),

  getOverview: (token: string, assetCode = "CNY") =>
    request<WalletOverviewView>(
      `${ENDPOINTS.PORTAL.WALLET_OVERVIEW}?assetCode=${encodeURIComponent(assetCode)}`,
      { headers: authHeaders(token) },
    ),

  getCapability: (token: string) =>
    request<WalletCapabilityView>(ENDPOINTS.PORTAL.WALLET_CAPABILITY, {
      headers: authHeaders(token),
    }),

  getAssetCapability: (token: string, assetCode: string) =>
    request<WalletAssetCapabilityView>(ENDPOINTS.PORTAL.WALLET_ACCOUNT_CAPABILITY(assetCode), {
      headers: authHeaders(token),
    }),

  getMovements: (params: WalletMovementsQuery, token: string): Promise<PagedResponse<WalletMovementView>> => {
    const { bucket, assetCode, page = 0, size = 20 } = params;
    return pagedGet<WalletMovementView>(
      ENDPOINTS.PORTAL.WALLET_ACCOUNT_MOVEMENTS(assetCode),
      { bucket, page, size },
      token,
    );
  },

  getNetworks: (token: string, assetCode: string) =>
    request<WalletNetworksResponse>(ENDPOINTS.PORTAL.WALLET_ACCOUNT_NETWORKS(assetCode), {
      headers: authHeaders(token),
    }),

  getAddresses: (token: string, assetCode: string, network: string) =>
    request<WalletAddressesResponse>(ENDPOINTS.PORTAL.WALLET_ACCOUNT_ADDRESSES(assetCode, network), {
      headers: authHeaders(token),
    }),

  getIdentitySummary: async (token: string, assetCode: string) => {
    const raw = await request<WalletIdentitySummaryView>(
      ENDPOINTS.PORTAL.WALLET_ACCOUNT_IDENTITY_SUMMARY(assetCode),
      { headers: authHeaders(token) },
    );
    return normalizeIdentitySummary(raw);
  },
};
