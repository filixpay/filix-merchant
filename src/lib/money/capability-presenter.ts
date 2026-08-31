import type { MoneyOpCapability } from "@/lib/api/domains/money";

/** Show Money-In / Payouts nav when the product surface is productized (even if Cap disables create). */
export function shouldShowInNav(op: MoneyOpCapability): boolean {
  return op.productized === true;
}

/** Create is available only when productized and Cap-enabled. */
export function isCreateAvailable(op: MoneyOpCapability): boolean {
  return op.productized === true && op.enabled === true;
}
