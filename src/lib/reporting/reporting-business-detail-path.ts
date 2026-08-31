import { moneyMoneyInDetailPath } from "@/lib/money/money-in-redirect";
import { moneyPayoutsDetailPath } from "@/lib/money/money-payouts-redirect";
import { moneyTransfersDetailPath } from "@/lib/money/money-transfers-redirect";
import { buildOrderDetailHref } from "@/components/orders/order-list-model";

/**
 * Map reporting orderType + businessId to an existing product detail path.
 * Returns null when there is no reusable business detail (caller uses Reporting DETAIL).
 */
export function resolveReportingBusinessDetailPath(
    locale: string,
    orderType: string | null | undefined,
    businessId: string | null | undefined,
): string | null {
    const id = businessId?.trim() ?? "";
    if (!id) return null;

    switch (orderType?.trim().toUpperCase()) {
        case "DEPOSIT":
            return moneyMoneyInDetailPath(locale, id);
        case "PAYOUT":
        case "WITHDRAWAL":
            return moneyPayoutsDetailPath(locale, id);
        case "TRANSFER":
            return moneyTransfersDetailPath(locale, id);
        case "TRADE":
            return buildOrderDetailHref(locale, id);
        case "REFUND":
            return `/${locale}/dashboard/refunds?merchantRefundId=${encodeURIComponent(id)}&view=detail`;
        default:
            return null;
    }
}

export function reportingTransactionFallbackPath(locale: string, reportId: string): string {
    return `/${locale}/dashboard/reporting/transactions/${reportId}`;
}
