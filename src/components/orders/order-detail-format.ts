import type { useTranslations } from "next-intl";

type OrdersTranslator = ReturnType<typeof useTranslations<"Orders">>;

export function formatOrderMoneyAmount(
    amount: number | string | undefined | null,
    currency: string | undefined,
    locale = "en-US",
): string {
    const code = currency?.trim() ?? "";
    if (amount == null || amount === "") {
        return code ? `${code} —` : "—";
    }
    const numeric = typeof amount === "number" ? amount : Number.parseFloat(String(amount));
    if (!Number.isFinite(numeric)) {
        return code ? `${code} —` : "—";
    }
    const formatted = numeric.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return code ? `${code} ${formatted}` : formatted;
}

export function getPaymentChannelLabel(
    channelCode: string | undefined,
    t: OrdersTranslator,
): string {
    if (!channelCode?.trim()) {
        return "-";
    }
    const key = `channel_codes.${channelCode}` as Parameters<OrdersTranslator>[0];
    if (t.has(key)) {
        return t(key);
    }
    return channelCode;
}

export function truncateMiddleText(value: string, head = 8, tail = 4): string {
    if (value.length <= head + tail + 1) {
        return value;
    }
    return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function formatTimelineTimestamp(value: string | undefined, locale: string): string {
    if (!value) {
        return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString(locale, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
}

export function isLikelyMaskedValue(value: string): boolean {
    return value.includes("*");
}
