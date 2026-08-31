import { normalizeCheckoutUrl } from "@/lib/checkout/checkout-url";

/** Normalize backend actionPath to a locale-prefixed dashboard route. */
export function resolveRiskActionPath(
    raw: string | undefined,
    locale: string,
): string | undefined {
    if (!raw) {
        return undefined;
    }

    if (/^https?:\/\//i.test(raw)) {
        return normalizeCheckoutUrl(raw);
    }

    const withLocale = (path: string) =>
        `/${locale}${path.startsWith("/") ? path : `/${path}`}`;

    if (raw.startsWith("/risk/fraud-events/")) {
        return withLocale(raw.replace("/risk/fraud-events/", "/dashboard/fraud/"));
    }
    if (raw.startsWith("/risk/reviews/")) {
        return withLocale(raw.replace("/risk/reviews/", "/dashboard/risk-reviews/"));
    }
    if (raw.startsWith("/risk/disputes/")) {
        return withLocale(raw.replace("/risk/disputes/", "/dashboard/disputes/"));
    }

    if (raw.startsWith("/dashboard/risk/fraud-events/")) {
        return withLocale(raw.replace("/dashboard/risk/fraud-events/", "/dashboard/fraud/"));
    }
    if (raw.startsWith("/dashboard/risk/reviews/")) {
        return withLocale(raw.replace("/dashboard/risk/reviews/", "/dashboard/risk-reviews/"));
    }

    if (raw.startsWith("/dashboard/") || raw.startsWith("/payments/")) {
        return withLocale(raw);
    }

    return withLocale(raw);
}
