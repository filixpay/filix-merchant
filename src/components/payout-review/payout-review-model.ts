/**
 * Helper functions for Payout Review.
 */

export function getPayoutReviewStatusColor(status: string): string {
    switch (status) {
        case "SUCCESS":
            return "success";
        case "PENDING":
            return "processing";
        case "FAILED":
            return "error";
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
