import type { MoneyActivityItem } from "@/lib/api/domains/money/types";
import { presentMoneyStatus, type MoneyStatusTone } from "./status-presenter";

export interface MoneyActivityDisplayRow {
  sourceId: string;
  /** Raw sourceType code — localize via MoneyCommon.sources. */
  sourceType: string;
  /** Raw movementType code — localize via MoneyCommon.movementTypes. */
  movementType: string | null;
  amount: string;
  assetCode: string;
  /** Raw status code — localize via MoneyCommon.statuses. */
  statusCode: string;
  statusTone: MoneyStatusTone;
  occurredAt: string;
}

/**
 * Map Activity product rows to display fields.
 * Codes only — MUST NOT select execution endpoints from movementType/sourceType.
 * UI owns localization.
 */
export function presentMoneyActivityItem(item: MoneyActivityItem): MoneyActivityDisplayRow {
  const sourceType = item.sourceType?.trim() || "UNKNOWN";
  const movementType = item.movementType?.trim() || null;
  const status = presentMoneyStatus(item.status);

  return {
    sourceId: item.sourceId,
    sourceType,
    movementType,
    amount: item.amount,
    assetCode: item.assetCode,
    statusCode: status.code,
    statusTone: status.tone,
    occurredAt: item.occurredAt,
  };
}

export function moneyStatusToneToTagColor(
  tone: MoneyStatusTone,
): "success" | "warning" | "error" | "default" {
  switch (tone) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "error";
    default:
      return "default";
  }
}
