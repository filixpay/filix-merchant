/**
 * Helper functions for Payout Audit.
 */

export function getPayoutAuditStatusColor(status: string): string {
    switch (status) {
        case "APPROVED":
            return "success";
        case "PENDING":
            return "processing";
        case "REJECTED":
            return "error";
        case "FAILED":
            return "error";
        case "SUCCESS":
            return "success";
        case "PROCESSING":
            return "warning";
        default:
            return "default";
    }
}

export function formatAmount(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
}
