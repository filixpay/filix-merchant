const REASON_MESSAGES: Record<string, string> = {
  NOT_PRODUCTIZED: "This money product is not available yet.",
  CAPABILITY_DISABLED: "This action is currently disabled.",
  OWNER_NOT_SUPPORTED: "This owner type is not supported for this money action.",
  INSUFFICIENT_BALANCE: "Insufficient available balance.",
  MISSING_ACCESS_TOKEN: "Please sign in again to continue.",
  NO_MERCHANT_ACCESS: "You do not have merchant access for this action.",
};

export interface MoneyProductErrorInput {
  reasonCode?: string | null;
  code?: string | number | null;
  message?: string | null;
}

/**
 * Map reasonCode / ApiError code to a user-facing message.
 * Branches on stable codes only — never on server message text.
 */
export function presentMoneyProductError(input: MoneyProductErrorInput): string {
  const key = String(input.reasonCode ?? input.code ?? "").trim();
  if (key && REASON_MESSAGES[key]) {
    return REASON_MESSAGES[key];
  }
  return "Unable to complete this money action. Please try again.";
}
