const LEGACY_CHECKOUT_HOSTS = new Set([
  "www.filixpay.com",
  "filixpay.com",
  "pay.filixpay.com",
]);

/** Public checkout host from NEXT_PUBLIC_CHECKOUT_URL (required in production). */
export function getCheckoutBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_CHECKOUT_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3001";
  }
  throw new Error("NEXT_PUBLIC_CHECKOUT_URL is required (no production defaults in open builds)");
}

function stripCheckoutPrefix(pathname: string): string {
  if (pathname === "/checkout" || pathname === "/checkout/") {
    return "/";
  }
  if (pathname.startsWith("/checkout/")) {
    return pathname.slice("/checkout".length);
  }
  return pathname;
}

/** Build a hosted checkout payment URL from a payment token. */
export function buildCheckoutTokenUrl(token: string): string | null {
  const trimmed = token.trim();
  if (!trimmed) {
    return null;
  }

  const url = new URL(getCheckoutBaseUrl());
  url.searchParams.set("token", trimmed);
  return url.toString();
}

/** Rewrite legacy www/pay checkout URLs to the configured checkout host. */
export function normalizeCheckoutUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
  }

  const base = getCheckoutBaseUrl();

  if (trimmed.startsWith("/")) {
    const hashIndex = trimmed.indexOf("#");
    const pathAndQuery = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;
    const hash = hashIndex >= 0 ? trimmed.slice(hashIndex) : "";
    const queryIndex = pathAndQuery.indexOf("?");
    const pathname = queryIndex >= 0 ? pathAndQuery.slice(0, queryIndex) : pathAndQuery;
    const query = queryIndex >= 0 ? pathAndQuery.slice(queryIndex) : "";
    const normalizedPath = stripCheckoutPrefix(pathname);
    const url = new URL(normalizedPath === "/" ? `${base}/` : `${base}${normalizedPath}`);

    if (query) {
      url.search = query;
    }

    return `${url.toString()}${hash}`;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    let checkoutHost = "";
    try {
      checkoutHost = new URL(base).hostname.toLowerCase();
    } catch {
      checkoutHost = "";
    }

    if (checkoutHost && host === checkoutHost) {
      const cleanedPath = stripCheckoutPrefix(url.pathname);
      url.pathname = cleanedPath === "/" ? "/" : cleanedPath;
      return url.toString();
    }

    if (
      LEGACY_CHECKOUT_HOSTS.has(host) &&
      (url.pathname === "/checkout" || url.pathname.startsWith("/checkout/"))
    ) {
      const subpath = stripCheckoutPrefix(url.pathname);
      const target = new URL(subpath === "/" ? `${base}/` : `${base}${subpath}`);
      target.search = url.search;
      target.hash = url.hash;
      return target.toString();
    }
  } catch {
    // fall through
  }

  return trimmed;
}

/** Extract token query param from a checkout URL, if present. */
export function extractCheckoutToken(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed, getCheckoutBaseUrl());
    return url.searchParams.get("token");
  } catch {
    const match = trimmed.match(/[?&]token=([^&]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}
