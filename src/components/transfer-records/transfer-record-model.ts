/**
 * Helper functions for Transfer Records.
 */

import type { Amount } from "@/lib/api";

export type FormattableAmount = Amount | { amount?: number | string; currency?: string };

export function getTransferStatusColor(status: string): string {
    switch (status) {
        case "SUCCESS":
            return "success";
        case "PENDING":
            return "processing";
        case "FAILED":
            return "error";
        case "PROCESSING":
            return "warning";
        default:
            return "default";
    }
}

export function formatAmount(amount: FormattableAmount | null | undefined): string {
    if (!amount) return "-";
    const currency = amount.currency || "CNY";
    const val = typeof amount.amount === "number" ? amount.amount : parseFloat(amount.amount || "0");
    return val.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
        currency: currency,
    });
}
