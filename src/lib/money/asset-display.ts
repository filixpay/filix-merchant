import { resolveDisplayFractionDigits } from "@/lib/money/amount-formatter";

const ASSET_FLAG_EMOJI: Record<string, string> = {
  EUR: "🇪🇺",
  USD: "🇺🇸",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CNY: "🇨🇳",
  HKD: "🇭🇰",
  AUD: "🇦🇺",
  CAD: "🇨🇦",
  CHF: "🇨🇭",
  SGD: "🇸🇬",
  KRW: "🇰🇷",
  TWD: "🇹🇼",
  NZD: "🇳🇿",
  SEK: "🇸🇪",
  NOK: "🇳🇴",
  DKK: "🇩🇰",
  PLN: "🇵🇱",
  THB: "🇹🇭",
  MYR: "🇲🇾",
  PHP: "🇵🇭",
  IDR: "🇮🇩",
  INR: "🇮🇳",
  AED: "🇦🇪",
  SAR: "🇸🇦",
  USDT: "₮",
};

export function getAssetFlagEmoji(assetCode: string): string {
  return ASSET_FLAG_EMOJI[assetCode.toUpperCase()] ?? assetCode.slice(0, 1);
}

export type WalletAmountDisplay = {
  symbol: string;
  amount: string;
  assetCode: string;
};

/**
 * Wallet card amount parts — symbol prefix + tabular number, asset code shown separately in UI.
 */
export function formatWalletAmountDisplay(
  amount: string,
  assetCode: string,
  locale = "en-US",
): WalletAmountDisplay {
  const raw = amount?.trim() ?? "";
  const code = assetCode.toUpperCase();

  if (!raw || !/^-?\d+(\.\d+)?$/.test(raw)) {
    return { symbol: "", amount: raw || "—", assetCode: code };
  }

  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    return { symbol: "", amount: raw, assetCode: code };
  }

  const digits = resolveDisplayFractionDigits(raw, code);

  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).formatToParts(numeric);

    const symbol = parts.find((p) => p.type === "currency")?.value ?? "";
    const amountText = parts
      .filter((p) => p.type === "integer" || p.type === "group" || p.type === "decimal" || p.type === "fraction")
      .map((p) => p.value)
      .join("");

    return { symbol, amount: amountText, assetCode: code };
  } catch {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(numeric);
    return { symbol: "", amount: formatted, assetCode: code };
  }
}

/** Currency symbol prefix for amount inputs (e.g. €, $). Empty when unknown. */
export function getCurrencySymbol(assetCode: string, locale = "en-US"): string {
  return formatWalletAmountDisplay("0", assetCode, locale).symbol;
}

import type { CapAvailabilityStatus } from "@/lib/money/balance-visibility";

export type WalletRestrictionOperation = "moneyIn" | "payout" | "transfer";

export type WalletRestriction = {
  operation: WalletRestrictionOperation;
  reasonCode: string | null;
};

export function isWalletHealthy(
  moneyIn: CapAvailabilityStatus,
  payout: CapAvailabilityStatus,
  transfer: CapAvailabilityStatus,
): boolean {
  const statuses = [moneyIn, payout];
  if (transfer !== "UNKNOWN") {
    statuses.push(transfer);
  }
  return statuses.every((status) => status === "ALLOW");
}

export function transferCapStatus(
  cap: { transfer: { productized: boolean; enabled: boolean } } | undefined,
): CapAvailabilityStatus {
  if (!cap) {
    return "UNKNOWN";
  }
  if (cap.transfer.productized && cap.transfer.enabled) {
    return "ALLOW";
  }
  if (cap.transfer.productized) {
    return "UNAVAILABLE";
  }
  return "UNKNOWN";
}

export function getWalletRestrictions(input: {
  moneyIn: CapAvailabilityStatus;
  payout: CapAvailabilityStatus;
  cap:
    | {
        moneyIn: { reasonCode: string | null };
        payout: { reasonCode: string | null };
        transfer: { productized: boolean; enabled: boolean; reasonCode: string | null };
      }
    | undefined;
}): WalletRestriction[] {
  const restrictions: WalletRestriction[] = [];
  const transfer = transferCapStatus(input.cap);

  if (input.moneyIn !== "ALLOW") {
    restrictions.push({
      operation: "moneyIn",
      reasonCode: input.cap?.moneyIn.reasonCode ?? null,
    });
  }
  if (input.payout !== "ALLOW") {
    restrictions.push({
      operation: "payout",
      reasonCode: input.cap?.payout.reasonCode ?? null,
    });
  }
  if (transfer !== "UNKNOWN" && transfer !== "ALLOW") {
    restrictions.push({
      operation: "transfer",
      reasonCode: input.cap?.transfer.reasonCode ?? null,
    });
  }

  return restrictions;
}
