import type { OrderView, PagedResponse } from '@/lib/api';

export const ORDER_TRADE_STATUS_OPTIONS = [
    'PENDING',
    'PROCESSING',
    'PARTIAL_SUCCESS',
    'SUCCESS',
    'CLOSED',
    'FAILED',
    'REQUIRES_CAPTURE',
    'DISPUTED',
] as const;

export type OrderTradeStatus = (typeof ORDER_TRADE_STATUS_OPTIONS)[number];

export interface OrderListQuery {
    page: number;
    size: number;
    merchantOrderId: string;
    tradeNo: string;
    buyerCode: string;
    tradeStatus: string;
    subMerchantId: string;
    locationId: string;
    channelCode: string;
    minAmount: string;
    maxAmount: string;
    startTime?: string;
    endTime?: string;
    paidStartTime?: string;
    paidEndTime?: string;
}

export interface OrderSearchFormValues {
    merchantOrderId?: string;
    tradeNo?: string;
    buyerCode?: string;
    tradeStatus?: OrderTradeStatus;
    subMerchantId?: number;
    locationId?: number;
    channelCode?: string;
    minAmount?: number;
    maxAmount?: number;
    createdTimeRange?: [unknown, unknown];
    paidTimeRange?: [unknown, unknown];
}

export interface NormalizedOrderPage {
    orders: OrderView[];
    total: number;
}

export const DEFAULT_ORDER_LIST_QUERY: OrderListQuery = {
    page: 0,
    size: 20,
    merchantOrderId: '',
    tradeNo: '',
    buyerCode: '',
    tradeStatus: '',
    subMerchantId: '',
    locationId: '',
    channelCode: '',
    minAmount: '',
    maxAmount: '',
};

export function getOrderRows(response: PagedResponse<OrderView>): NormalizedOrderPage {
    return {
        orders: response.content ?? response.data ?? [],
        total: response.total ?? 0,
    };
}

export function buildOrderSearchParams(query: OrderListQuery): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: query.page,
        size: query.size,
    };

    if (query.merchantOrderId.trim()) params.merchantOrderId = query.merchantOrderId.trim();
    if (query.tradeNo.trim()) params.tradeNo = query.tradeNo.trim();
    if (query.buyerCode.trim()) params.buyerCode = query.buyerCode.trim();
    if (query.tradeStatus.trim()) params.tradeStatus = query.tradeStatus.trim();
    if (query.subMerchantId.trim()) params.subMerchantId = Number(query.subMerchantId.trim());
    if (query.locationId.trim()) params.locationId = Number(query.locationId.trim());
    if (query.channelCode.trim()) params.channelCode = query.channelCode.trim();
    if (query.minAmount.trim()) params.minAmount = query.minAmount.trim();
    if (query.maxAmount.trim()) params.maxAmount = query.maxAmount.trim();
    if (query.startTime) params.startTime = query.startTime;
    if (query.endTime) params.endTime = query.endTime;
    if (query.paidStartTime) params.paidStartTime = query.paidStartTime;
    if (query.paidEndTime) params.paidEndTime = query.paidEndTime;

    return params;
}

export function toApiDateTime(value: unknown): string | undefined {
    if (!value) return undefined;

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value === 'object' && value !== null && 'toDate' in value) {
        const dateValue = (value as { toDate: () => Date }).toDate();
        return dateValue.toISOString();
    }

    if (typeof value === 'object' && value !== null && 'toISOString' in value) {
        return (value as { toISOString: () => string }).toISOString();
    }

    return undefined;
}

export function getOrderStatus(order: OrderView): string {
    return order.tradeStatus || (order as OrderView & { orderStatus?: string }).orderStatus || '-';
}

export function normalizeOrderType(orderType: string | null | undefined): string | undefined {
    const key = orderType?.trim().toUpperCase();
    return key ? key : undefined;
}

export interface OrderPartyDisplay {
    name?: string;
    code?: string;
}

export function getOrderPartyDisplay(
    party?: { name?: string; alias?: string; code?: string | number } | null,
    fallbackCode?: string | number | null,
): OrderPartyDisplay {
    const name = party?.name?.trim() || party?.alias?.trim() || undefined;
    const rawCode = party?.code ?? fallbackCode;
    const code =
        rawCode == null || String(rawCode).trim() === "" ? undefined : String(rawCode);
    return { name, code };
}

export function hasOrderParty(display: OrderPartyDisplay): boolean {
    return Boolean(display.name || display.code);
}

export function getStatusTagColor(status: string): string {
    switch (status) {
        case 'PENDING': return 'processing';
        case 'PROCESSING': return 'cyan';
        case 'SUCCESS': return 'success';
        case 'PARTIAL_SUCCESS': return 'lime';
        case 'FAILED': return 'error';
        case 'CLOSED': return 'default';
        case 'DISPUTED': return 'orange';
        case 'REQUIRES_CAPTURE': return 'purple';
        default: return 'default';
    }
}

export function formatDateTime(value?: string): string {
    return value ? new Date(value).toLocaleString() : '-';
}

export function formatSmartDateTime(value?: string): string {
    if (!value) return '-';
    const date = new Date(value);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
}

export type OrderPageAmountByCurrency = {
    currency: string;
    amount: number;
};

export interface OrderPageStats {
    totalOrders: number;
    pageAmountsByCurrency: OrderPageAmountByCurrency[];
    successRate: number;
    pendingCount: number;
}

export function computeOrderPageStats(orders: OrderView[], total: number): OrderPageStats {
    const amountsByCurrency = new Map<string, number>();
    let successCount = 0;
    let pendingCount = 0;

    for (const order of orders) {
        const currency = order.totalAmount?.currency?.trim();
        const rawAmount = order.totalAmount?.amount ?? 0;
        const amount = typeof rawAmount === "number" ? rawAmount : parseFloat(String(rawAmount)) || 0;

        if (currency && amount !== 0) {
            amountsByCurrency.set(currency, (amountsByCurrency.get(currency) ?? 0) + amount);
        }

        const status = getOrderStatus(order);
        if (status === "SUCCESS") successCount++;
        if (status === "PENDING") pendingCount++;
    }

    const pageAmountsByCurrency = [...amountsByCurrency.entries()]
        .map(([currency, amount]) => ({ currency, amount }))
        .sort((a, b) => a.currency.localeCompare(b.currency));

    const successRate = orders.length > 0
        ? Math.round((successCount / orders.length) * 100)
        : 0;

    return { totalOrders: total, pageAmountsByCurrency, successRate, pendingCount };
}

export function formatAmount(order: OrderView): string {
    const currency = order.totalAmount?.currency ?? '';
    const amount = order.totalAmount?.amount ?? '-';
    return `${currency} ${amount}`.trim();
}

export function getOrderRefundAmounts(
    order: Pick<OrderView, "paidAmount" | "refundedAmount">,
): { refundedAmount: number; refundableAmount: number } {
    const refundedAmount = order.refundedAmount ?? 0;
    return {
        refundedAmount,
        refundableAmount: (order.paidAmount ?? 0) - refundedAmount,
    };
}

export function getRefundableAmount(order: OrderView): number {
    return getOrderRefundAmounts(order).refundableAmount;
}

/** Deep-link by system order id (`orders.id`). Prefer this for TRADE / reporting. */
export function buildOrderDetailHref(locale: string, orderId: string): string {
    const params = new URLSearchParams({
        id: orderId,
        view: "detail",
    });
    return `/${locale}/dashboard/orders?${params.toString()}`;
}

/** Legacy deep-link when only merchantOrderId is available (e.g. fraud/dispute tables). */
export function buildOrderDetailHrefByMerchantOrderId(
    locale: string,
    merchantOrderId: string,
): string {
    const params = new URLSearchParams({
        merchantOrderId,
        view: "detail",
    });
    return `/${locale}/dashboard/orders?${params.toString()}`;
}
