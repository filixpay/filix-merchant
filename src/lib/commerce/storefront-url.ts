/** Trim and treat empty as absent. Does not build URLs. */
export function normalizeStorefrontUrl(url: string | null | undefined): string | null {
  if (url == null) return null;
  const trimmed = url.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * True only for absolute http(s) URLs that `URL` can parse.
 * Display gate for shop hostname + purchase link — not publish status.
 */
export function isValidStorefrontUrl(url: string | null | undefined): boolean {
  const normalized = normalizeStorefrontUrl(url);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Hostname for shop label, or null if URL is not displayable. */
export function hostnameFromStorefrontUrl(url: string | null | undefined): string | null {
  const normalized = normalizeStorefrontUrl(url);
  if (!normalized || !isValidStorefrontUrl(normalized)) return null;
  try {
    return new URL(normalized).hostname;
  } catch {
    return null;
  }
}
