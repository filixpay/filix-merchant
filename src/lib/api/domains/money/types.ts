export interface MoneyGate {
  canView: boolean;
  moneyEnabled: boolean;
}

export interface MoneyOpCapability {
  productized: boolean;
  enabled: boolean;
  reasonCode: string | null;
}

export interface MoneyAssetCapability {
  assetCode: string;
  moneyIn: MoneyOpCapability;
  payout: MoneyOpCapability;
  transfer: MoneyOpCapability;
  payment: MoneyOpCapability;
}

export interface MoneyBalanceProjection {
  assetCode: string;
  available: string;
  asOf: string;
}

/** Present BalanceType bucket from Funds Projection (W14). Amount is a decimal string. */
export type MoneyBalanceBucket = {
  balanceType: "AVAILABLE" | "PENDING" | "CLEARING";
  amount: string;
};

/**
 * Present multi-asset projection row (W14).
 * Not an Asset catalog / Cap Decision — Cap remains a separate read.
 */
export type MoneyAssetBalance = {
  assetCode: string;
  buckets: MoneyBalanceBucket[];
  asOf: string;
};

export interface MoneyActivityItem {
  sourceType: string;
  sourceId: string;
  assetCode: string;
  amount: string;
  status: string;
  movementType?: string;
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoneyActivityQuery {
  assetCode?: string;
  /** All | In | Out | Transfer (or MONEY_IN / MONEY_OUT / TRANSFER). */
  movementType?: string;
  page?: number;
  size?: number;
}

/** Money-In product view — monetary amount is a decimal string when present. */
export interface MoneyInView {
  moneyInId: string;
  assetCode: string | null;
  amount: string | null;
  status: string;
  failureReason: string | null;
  occurredAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  /** Present on create/detail when FundingSession is payable. */
  fundingSessionId?: string | null;
  nextAction?: MoneyInNextAction | null;
}

export interface MoneyInCreateRequest {
  assetCode: string;
  /** Decimal string — never a number on Money domain types. */
  amount: string;
  clientRequestId: string;
}

/** Product projection for post-create funding — not a Money-In Domain Fact. */
export interface MoneyInNextAction {
  type: string;
  token: string | null;
  url: string | null;
}

/** Create Money-In response — may include fundingSessionId and CHECKOUT nextAction. */
export interface MoneyInCreateResponse extends MoneyInView {
  fundingSessionId: string | null;
  nextAction: MoneyInNextAction | null;
}

export interface MoneyInQuery {
  assetCode?: string;
  page?: number;
  size?: number;
}

/** Payout product view — monetary amount is a decimal string when present. */
export interface MoneyPayoutView {
  payoutId: string;
  assetCode: string | null;
  amount: string | null;
  status: string;
  failureReason: string | null;
  occurredAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  /** Present on create when initiate needs Product continue; null on success. */
  nextAction?: MoneyPayoutNextAction | null;
  /** Detail only — masked BANK destination; list omits this. */
  destination?: MoneyPayoutDestinationView | null;
}

export interface MoneyPayoutNextAction {
  type: string;
  reasonCode: string | null;
}

export interface MoneyPayoutDestinationView {
  destinationType: string;
  accountHolder: string;
  accountNumberMasked: string;
  bankName: string;
  bankBranchName: string | null;
}

/** ExternalAccount masked view — never includes full accountNumber or crypto address. */
export interface ExternalAccountView {
  id: string;
  type: string;
  status: string;
  country: string | null;
  currency: string | null;
  accountHolderName: string | null;
  accountNumberMasked: string | null;
  accountNumberLast4: string | null;
  bankName: string | null;
  bankCode: string | null;
  network?: string | null;
  addressMasked?: string | null;
  addressLast4?: string | null;
  memoTagPresent?: boolean;
  version: number;
  createdAt: string | null;
  updatedAt: string | null;
}

/** BANK create uses bank fields; CRYPTO uses network + cryptoAddress (+ optional memoTag). */
export interface ExternalAccountCreateRequest {
  type?: "BANK" | "CRYPTO";
  country?: string;
  currency?: string;
  accountHolderName?: string;
  /** Full account number on BANK create only; never returned on reads. */
  accountNumber?: string;
  bankName?: string | null;
  bankCode?: string | null;
  network?: string;
  /** Full address on CRYPTO create only; never returned on reads. */
  cryptoAddress?: string;
  memoTag?: string | null;
}

export interface ExternalAccountQuery {
  page?: number;
  size?: number;
}

export interface PayoutCreateRequest {
  assetCode: string;
  /** Decimal string — never a number on Money domain types. */
  amount: string;
  clientRequestId: string;
  /** 6-digit transaction password — verified server-side before Runtime. */
  paymentPin: string;
  /** ExternalAccount id (Money-Out P1 hard cut). */
  destinationAccountId: string;
}

export interface PayoutQuery {
  assetCode?: string;
  page?: number;
  size?: number;
}

/** Transfer product view — amount is a decimal string when present. nextAction always null this wave. */
export interface MoneyTransferView {
  transferId: string;
  assetCode: string | null;
  amount: string | null;
  status: string;
  failureReason: string | null;
  reasonCode: string | null;
  occurredAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  nextAction: MoneyTransferNextAction | null;
  counterparty?: MoneyTransferCounterparty | null;
}

export interface MoneyTransferNextAction {
  type: string;
  reasonCode: string | null;
}

export interface MoneyTransferCounterparty {
  ownerType: string;
  ownerId: string;
}

export interface TransferCreateRequest {
  assetCode: string;
  /** Decimal string — never a number on Money domain types. */
  amount: string;
  clientRequestId: string;
  targetMerchantCode: string;
  /** 6-digit transaction password — verified server-side before Runtime execute. */
  paymentPin: string;
}

export interface TransferQuery {
  assetCode?: string;
  page?: number;
  size?: number;
}
