import { PaymentSplitView } from "@/lib/api";

export type PaymentSplitStatus = PaymentSplitView["paymentSplitStatus"];
export type PaymentSplitType = PaymentSplitView["paymentSplitType"];

export function getStatusTagColor(status: PaymentSplitStatus): string {
    switch (status) {
        case "SUCCESS":
            return "success";
        case "FAILED":
            return "error";
        case "PENDING":
            return "processing";
        case "PROCESSING":
            return "warning";
        default:
            return "default";
    }
}

export function formatAmount(amount: number, currency: string = "USD"): string {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
        currency: currency,
    });
}
