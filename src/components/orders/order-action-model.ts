import type { OrderView, RefundCreateRequest, MissingOrderView } from "@/lib/api";
import { extractCheckoutToken } from "@/lib/checkout/checkout-url";

export type PaymentLinkExpiryKind = "countdown" | "datetime" | "long_lived" | "expired" | "unknown";

export interface PaymentLinkExpiry {
    kind: PaymentLinkExpiryKind;
    expiresAt: Date | null;
}

export const ORDER_ACTION_CURRENCIES = [
    "AUD",
    "BRL",
    "CAD",
    "CNY",
    "CZK",
    "DKK",
    "EUR",
    "HKD",
    "HUF",
    "ILS",
    "JPY",
    "MYR",
    "MXN",
    "TWD",
    "NZD",
    "NOK",
    "PHP",
    "PLN",
    "GBP",
    "SGD",
    "SEK",
    "CHF",
    "THB",
    "USD",
] as const;

export type OrderActionCurrency = (typeof ORDER_ACTION_CURRENCIES)[number];

export const ZERO_DECIMAL_ACTION_CURRENCIES = new Set<string>(["JPY", "HUF", "TWD"]);

export type PaymentActionOrder = Pick<OrderView, "merchantOrderId" | "totalAmount">;

export interface RefundCreateInitialData {
    tradeNo?: string;
    amount?: number;
    currency?: string;
    reason?: string;
}

export interface RefundCreateFormValues {
    tradeNo: string;
    merchantRefundId: string;
    reason: string;
    amount: number;
    currency: string;
}

export type RefundCreatePayload = RefundCreateRequest;

export type MissingOrderData = MissingOrderView;

export function generateMerchantRefundId(date = new Date()): string {
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 100000).toString().padStart(6, "0");
    return `MERCHANT_REFUND_${yyyymmdd}${random}`;
}

export function createRefundFormValues(
    initialData: RefundCreateInitialData | undefined,
    defaultReason: string,
): RefundCreateFormValues {
    return {
        tradeNo: initialData?.tradeNo || "",
        merchantRefundId: generateMerchantRefundId(),
        reason: initialData?.reason || defaultReason,
        amount: initialData?.amount || 0,
        currency: initialData?.currency || "USD",
    };
}

export function buildRefundCreatePayload(values: RefundCreateFormValues): RefundCreatePayload {
    return {
        tradeNo: values.tradeNo,
        merchantRefundId: values.merchantRefundId,
        reason: values.reason,
        totalAmount: {
            amount: Number(values.amount) || 0,
            currency: values.currency,
        },
    };
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
    const segments = token.split(".");
    if (segments.length < 2) {
        return null;
    }

    try {
        const base64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
        const decoded = atob(padded);
        const payload = JSON.parse(decoded) as Record<string, unknown>;
        return payload && typeof payload === "object" ? payload : null;
    } catch {
        return null;
    }
}

function parseExpiryTimestamp(raw: unknown): Date | null {
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return new Date(raw > 1_000_000_000_000 ? raw : raw * 1000);
    }

    if (typeof raw === "string" && raw.trim()) {
        const numeric = Number(raw);
        if (Number.isFinite(numeric)) {
            return new Date(numeric > 1_000_000_000_000 ? numeric : numeric * 1000);
        }

        const parsed = Date.parse(raw);
        if (!Number.isNaN(parsed)) {
            return new Date(parsed);
        }
    }

    return null;
}

function parseColonSeparatedExpiry(token: string): Date | null {
    const payload = token.split(".")[0] ?? token;
    const parts = payload.split(":");
    if (parts.length < 3) {
        return null;
    }

    return parseExpiryTimestamp(parts[2]);
}

function parseJwtExpiry(token: string): Date | null {
    const payload = decodeJwtPayload(token);
    if (!payload) {
        return null;
    }

    return parseExpiryTimestamp(payload.exp ?? payload.expiresAt ?? payload.expires_at);
}

export function parsePaymentLinkExpiry(paymentLink: string, now = Date.now()): PaymentLinkExpiry {
    const token = extractCheckoutToken(paymentLink);
    if (!token) {
        return { kind: "long_lived", expiresAt: null };
    }

    const expiresAt = parseJwtExpiry(token) ?? parseColonSeparatedExpiry(token);
    if (!expiresAt) {
        return { kind: "long_lived", expiresAt: null };
    }

    if (expiresAt.getTime() <= now) {
        return { kind: "expired", expiresAt };
    }

    const remainingMs = expiresAt.getTime() - now;
    if (remainingMs <= 24 * 60 * 60 * 1000) {
        return { kind: "countdown", expiresAt };
    }

    return { kind: "datetime", expiresAt };
}

export function formatPaymentExpiryCountdown(expiresAt: Date, now = Date.now()): string {
    const remainingMs = Math.max(0, expiresAt.getTime() - now);
    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const mm = minutes.toString().padStart(2, "0");
    const ss = seconds.toString().padStart(2, "0");
    return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** @deprecated Prefer parsePaymentLinkExpiry for structured expiry handling. */
export function getPaymentExpiryTime(paymentLink: string): string {
    const expiry = parsePaymentLinkExpiry(paymentLink);
    if (expiry.kind === "long_lived") {
        return "";
    }
    if (!expiry.expiresAt) {
        return "";
    }
    return expiry.expiresAt.toLocaleString();
}
