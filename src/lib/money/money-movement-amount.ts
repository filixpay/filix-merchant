import { formatUnsignedMoneyAmount } from "./amount-formatter";

export type MoneyAmountTone = "inflow" | "outflow" | "transfer" | "neutral";
export type MoneyMovementAmountSemantic = MoneyAmountTone;

export type MoneyAmountPresentation = {
  amountBody: string;
  sign: "+" | "-" | null;
  tone: MoneyAmountTone;
};

const KNOWN_MOVEMENT_TYPES = new Set(["MONEY_IN", "MONEY_OUT", "PAYOUT", "TRANSFER"]);
const KNOWN_SOURCE_TYPES = new Set([
  "MONEY_IN_INTENT",
  "MONEY_OUT_INTENT",
  "TRANSFER_RECORD",
]);

function mapMovementType(code: string): MoneyMovementAmountSemantic | null {
  switch (code) {
    case "MONEY_IN":
      return "inflow";
    case "MONEY_OUT":
    case "PAYOUT":
      return "outflow";
    case "TRANSFER":
      return "transfer";
    default:
      return null;
  }
}

function mapSourceType(code: string): MoneyMovementAmountSemantic | null {
  switch (code) {
    case "MONEY_IN_INTENT":
      return "inflow";
    case "MONEY_OUT_INTENT":
      return "outflow";
    case "TRANSFER_RECORD":
      return "transfer";
    default:
      return null;
  }
}

/**
 * Display-only Activity mapping. Does not assert product identity or lifecycle.
 * Strict rule: known unsupported movementType → neutral (no sourceType fallback).
 */
export function resolveActivityAmountSemantic(input: {
  movementType?: string | null;
  sourceType?: string | null;
}): MoneyMovementAmountSemantic {
  const movementType = input.movementType?.trim() ?? "";
  if (movementType) {
    if (KNOWN_MOVEMENT_TYPES.has(movementType)) {
      return mapMovementType(movementType) ?? "neutral";
    }
    return "neutral";
  }
  const sourceType = input.sourceType?.trim() ?? "";
  if (sourceType && KNOWN_SOURCE_TYPES.has(sourceType)) {
    return mapSourceType(sourceType) ?? "neutral";
  }
  return "neutral";
}

export function presentMoneyMovementAmount(input: {
  amount: string | null | undefined;
  assetCode: string | null | undefined;
  semantic: MoneyMovementAmountSemantic;
  locale?: string;
}): MoneyAmountPresentation {
  const assetCode = input.assetCode?.trim() || "CNY";
  const amount = input.amount ?? "";
  const amountBody =
    amount.trim() === ""
      ? "—"
      : formatUnsignedMoneyAmount(amount, assetCode, input.locale ?? "en-US");

  switch (input.semantic) {
    case "inflow":
      return { amountBody, sign: amountBody === "—" ? null : "+", tone: "inflow" };
    case "outflow":
      return { amountBody, sign: amountBody === "—" ? null : "-", tone: "outflow" };
    case "transfer":
      return { amountBody, sign: null, tone: "transfer" };
    default:
      return { amountBody, sign: null, tone: "neutral" };
  }
}
