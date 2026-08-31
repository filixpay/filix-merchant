import type {
  MerchantLedgerMovementView,
  MerchantPortalBucket,
} from "@/lib/api/domains/merchants";

/** Spec §2.5 — MERCHANT_PAYABLE / LIABILITY only. UI owns this mapping. */
export function merchantPayableDisplaySignPrefix(
  direction: "CREDIT" | "DEBIT",
): "+" | "-" {
  return direction === "CREDIT" ? "+" : "-";
}

/** Overview drill-in is only for AVAILABLE | PENDING (BM-DEC-003). */
export function isLedgerMovementBucket(
  balanceType: string,
): balanceType is MerchantPortalBucket {
  return balanceType === "AVAILABLE" || balanceType === "PENDING";
}

export type MerchantLedgerMovementRow = {
  movementId: string;
  occurredAt: string;
  businessType: string;
  journalNumber: string;
  direction: "CREDIT" | "DEBIT";
  amount: number;
  assetCode: string;
  bucket: string;
  referenceId: string;
  externalReference: string | null;
  signedAmountPrefix: "+" | "-";
  /** Null when API did not return a running balance. */
  balanceAfter: number | null;
};

function parseOptionalAmount(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function toMerchantLedgerMovementRow(
  view: MerchantLedgerMovementView,
): MerchantLedgerMovementRow {
  const amount = typeof view.amount === "number" ? view.amount : Number(view.amount);
  return {
    movementId: view.movementId,
    occurredAt: view.postedAt,
    businessType: view.businessType,
    journalNumber: view.journalNumber,
    direction: view.direction,
    amount: Number.isFinite(amount) ? Math.abs(amount) : 0,
    assetCode: view.currency,
    bucket: view.bucket,
    referenceId: view.businessId,
    externalReference: view.externalReference ?? null,
    signedAmountPrefix: merchantPayableDisplaySignPrefix(view.direction),
    balanceAfter: parseOptionalAmount(view.balanceAfter),
  };
}
