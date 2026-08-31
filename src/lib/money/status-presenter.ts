export type MoneyStatusTone = "success" | "warning" | "danger" | "neutral";

export interface MoneyStatusPresentation {
  /** Raw product status code (localize in UI). */
  code: string;
  tone: MoneyStatusTone;
}

const STATUS_TONE: Record<string, MoneyStatusTone> = {
  POSTED: "success",
  COMPLETED: "success",
  CLEARED: "success",
  REQUESTED: "warning",
  PENDING: "warning",
  PROCESSING: "warning",
  CONFIRMED: "warning",
  FAILED: "danger",
  REJECTED: "danger",
  CANCELLED: "neutral",
  CANCELED: "neutral",
};

/** Map product status strings to code + tone. Labels belong in i18n. */
export function presentMoneyStatus(status: string): MoneyStatusPresentation {
  const key = status?.trim() ?? "";
  if (!key) {
    return { code: "UNKNOWN", tone: "neutral" };
  }
  return { code: key, tone: STATUS_TONE[key] ?? "neutral" };
}
