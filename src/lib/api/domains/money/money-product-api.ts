import { ENDPOINTS } from "../../../api-config";
import { authHeaders, request } from "../../core";
import { pagedGet } from "../../query";
import type { PagedResponse } from "../../types";
import type {
  ExternalAccountCreateRequest,
  ExternalAccountQuery,
  ExternalAccountView,
  MoneyActivityItem,
  MoneyActivityQuery,
  MoneyAssetBalance,
  MoneyAssetCapability,
  MoneyBalanceProjection,
  MoneyGate,
  MoneyInCreateRequest,
  MoneyInCreateResponse,
  MoneyInQuery,
  MoneyInView,
  MoneyPayoutView,
  MoneyTransferView,
  PayoutCreateRequest,
  PayoutQuery,
  TransferCreateRequest,
  TransferQuery,
} from "./types";

export const moneyProductApi = {
  getGate: (token: string) =>
    request<MoneyGate>(ENDPOINTS.PORTAL.MONEY_GATE, {
      headers: authHeaders(token),
    }),

  getAssetCapability: (token: string, assetCode: string) =>
    request<MoneyAssetCapability>(ENDPOINTS.PORTAL.MONEY_ASSET_CAPABILITY(assetCode), {
      headers: authHeaders(token),
    }),

  getBalance: (token: string, assetCode = "CNY") =>
    request<MoneyBalanceProjection>(
      `${ENDPOINTS.PORTAL.MONEY_BALANCE}?assetCode=${encodeURIComponent(assetCode)}`,
      { headers: authHeaders(token) },
    ),

  /** Present Balance Projections only — not Cap catalog; Cap via getAssetCapability. */
  listBalances: (token: string) =>
    request<MoneyAssetBalance[]>(ENDPOINTS.PORTAL.MONEY_BALANCES, {
      headers: authHeaders(token),
    }),

  getActivity: (
    params: MoneyActivityQuery,
    token: string,
  ): Promise<PagedResponse<MoneyActivityItem>> => {
    const { assetCode, movementType, page = 0, size = 20 } = params;
    const query: Record<string, string | number> = { page, size };
    if (assetCode) query.assetCode = assetCode;
    if (movementType) query.movementType = movementType;
    return pagedGet<MoneyActivityItem>(ENDPOINTS.PORTAL.MONEY_ACTIVITY, query, token);
  },

  createMoneyIn: (data: MoneyInCreateRequest, token: string) =>
    request<MoneyInCreateResponse>(ENDPOINTS.PORTAL.MONEY_MONEY_INS, {
      method: "POST",
      body: JSON.stringify(data),
      headers: authHeaders(token),
    }),

  listMoneyIns: (
    params: MoneyInQuery,
    token: string,
  ): Promise<PagedResponse<MoneyInView>> => {
    const { assetCode, page = 0, size = 20 } = params;
    return pagedGet<MoneyInView>(
      ENDPOINTS.PORTAL.MONEY_MONEY_INS,
      assetCode ? { assetCode, page, size } : { page, size },
      token,
    );
  },

  getMoneyIn: (id: string, token: string) =>
    request<MoneyInView>(ENDPOINTS.PORTAL.MONEY_MONEY_IN(id), {
      headers: authHeaders(token),
    }),

  createPayout: (data: PayoutCreateRequest, token: string) =>
    request<MoneyPayoutView>(ENDPOINTS.PORTAL.MONEY_PAYOUTS, {
      method: "POST",
      body: JSON.stringify(data),
      headers: authHeaders(token),
    }),

  listPayouts: (
    params: PayoutQuery,
    token: string,
  ): Promise<PagedResponse<MoneyPayoutView>> => {
    const { assetCode, page = 0, size = 20 } = params;
    return pagedGet<MoneyPayoutView>(
      ENDPOINTS.PORTAL.MONEY_PAYOUTS,
      assetCode ? { assetCode, page, size } : { page, size },
      token,
    );
  },

  getPayout: (id: string, token: string) =>
    request<MoneyPayoutView>(ENDPOINTS.PORTAL.MONEY_PAYOUT(id), {
      headers: authHeaders(token),
    }),

  listExternalAccounts: (
    params: ExternalAccountQuery,
    token: string,
  ): Promise<PagedResponse<ExternalAccountView>> => {
    const { page = 0, size = 20 } = params;
    return pagedGet<ExternalAccountView>(
      ENDPOINTS.PORTAL.MONEY_EXTERNAL_ACCOUNTS,
      { page, size },
      token,
    );
  },

  createExternalAccount: (data: ExternalAccountCreateRequest, token: string) =>
    request<ExternalAccountView>(ENDPOINTS.PORTAL.MONEY_EXTERNAL_ACCOUNTS, {
      method: "POST",
      body: JSON.stringify(data),
      headers: authHeaders(token),
    }),

  getExternalAccount: (id: string, token: string) =>
    request<ExternalAccountView>(ENDPOINTS.PORTAL.MONEY_EXTERNAL_ACCOUNT(id), {
      headers: authHeaders(token),
    }),

  disableExternalAccount: (id: string, token: string) =>
    request<ExternalAccountView>(ENDPOINTS.PORTAL.MONEY_EXTERNAL_ACCOUNT_DISABLE(id), {
      method: "POST",
      headers: authHeaders(token),
    }),

  createTransfer: (data: TransferCreateRequest, token: string) =>
    request<MoneyTransferView>(ENDPOINTS.PORTAL.MONEY_TRANSFERS, {
      method: "POST",
      body: JSON.stringify(data),
      headers: authHeaders(token),
    }),

  listTransfers: (
    params: TransferQuery,
    token: string,
  ): Promise<PagedResponse<MoneyTransferView>> => {
    const { assetCode, page = 0, size = 20 } = params;
    return pagedGet<MoneyTransferView>(
      ENDPOINTS.PORTAL.MONEY_TRANSFERS,
      assetCode ? { assetCode, page, size } : { page, size },
      token,
    );
  },

  getTransfer: (id: string, token: string) =>
    request<MoneyTransferView>(ENDPOINTS.PORTAL.MONEY_TRANSFER(id), {
      headers: authHeaders(token),
    }),
};
