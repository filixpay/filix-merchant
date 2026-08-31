import type { MoneyInNextAction } from "@/lib/api/domains/money/types";
import {
  buildCheckoutTokenUrl,
  extractCheckoutToken,
  normalizeCheckoutUrl,
} from "@/lib/checkout/checkout-url";

/**
 * Resolve a Checkout URL from a Money-In create nextAction.
 * Returns null unless type is CHECKOUT and a payment token is available.
 */
export function resolveMoneyInCheckoutUrl(
  nextAction: MoneyInNextAction | null | undefined,
): string | null {
  if (!nextAction || nextAction.type !== "CHECKOUT") {
    return null;
  }

  const token = nextAction.token?.trim();
  if (token) {
    return buildCheckoutTokenUrl(token);
  }

  const url = nextAction.url?.trim();
  if (!url) {
    return null;
  }

  const urlToken = extractCheckoutToken(url);
  if (urlToken) {
    return buildCheckoutTokenUrl(urlToken);
  }

  if (url.startsWith("/")) {
    return normalizeCheckoutUrl(url);
  }

  return normalizeCheckoutUrl(url);
}
