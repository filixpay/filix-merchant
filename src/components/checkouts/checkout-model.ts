import type { CheckoutView } from "@/lib/api";

export function getCheckoutStatusColor(status: string): string {
    return status === "ACTIVE" ? "success" : "default";
}

export function resolveCheckoutTitle(
    checkout: CheckoutView,
    locale: string,
): string {
    const zhTitle =
        checkout.checkoutTitles?.["zh_CN"] ||
        checkout.checkoutTitles?.["zh-CN"] ||
        checkout.titles?.["zh-CN"] ||
        checkout.titles?.["zh_CN"];
    const jaTitle =
        checkout.checkoutTitles?.["ja_JP"] ||
        checkout.checkoutTitles?.["ja-JP"] ||
        checkout.titles?.["ja-JP"] ||
        checkout.titles?.["ja_JP"];
    const enTitle = checkout.checkoutTitles?.["en"] || checkout.titles?.["en"];

    if (locale === "zh") return zhTitle || enTitle || checkout.checkoutCode;
    if (locale === "ja") return jaTitle || enTitle || checkout.checkoutCode;
    return enTitle || zhTitle || checkout.checkoutCode;
}

export function mapCheckoutToForm(checkout: CheckoutView) {
    const mappedTitles: Record<string, string> = {};
    const sourceTitles = checkout.checkoutTitles || checkout.titles || {};
    Object.entries(sourceTitles).forEach(([key, value]) => {
        mappedTitles[key.replace("_", "-")] = value;
    });

    return {
        id: checkout.id,
        checkoutCode: checkout.checkoutCode,
        titles: mappedTitles,
        logo: checkout.logo || "",
        color: checkout.color || "#0080FF",
        currencies: checkout.currencies || ["*"],
        buyerCountries: checkout.buyerCountries || ["*"],
        configs: checkout.configs || [],
    };
}
