import type { OrderCreateRequest, OrderItemRequest, OrderView } from "@/lib/api";

export const ORDER_CURRENCIES = [
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

export type OrderCurrency = (typeof ORDER_CURRENCIES)[number];

export const ZERO_DECIMAL_CURRENCIES = new Set<OrderCurrency>(["JPY", "HUF", "TWD"]);

export interface CreateOrderItemFormValue {
    businessProductId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
}

export interface DateLikeValue {
    toDate?: () => Date;
    toISOString?: () => string;
}

export interface CreateOrderFormValues {
    merchantOrderId: string;
    subject: string;
    currency: OrderCurrency;
    paymentExpiredAt: Date | DateLikeValue;
    orderItems: CreateOrderItemFormValue[];
    customerName?: string;
    customerEmail?: string;
    customermobile?: string;
    /** When true, create binds a Collection Destination (offline remittance). */
    offlineTransfer?: boolean;
    /** Mode-resolved Collection Destination id from resolve API. */
    collectionDestinationId?: string;
    /**
     * @deprecated Prefer collectionDestinationId when offlineTransfer is true.
     * Receipt receiving ExternalAccount id.
     */
    externalAccountId?: string;
    locationId?: number;
}

export function generateMerchantOrderId(date = new Date()): string {
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const timestamp = date.getTime().toString().slice(-4);

    return `${yyyymmdd}${timestamp}${random}`;
}

export function createDefaultOrderItem(): CreateOrderItemFormValue {
    return {
        businessProductId: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
    };
}

export function createDefaultOrderFormValues(): CreateOrderFormValues {
    return {
        merchantOrderId: generateMerchantOrderId(),
        subject: "",
        currency: "USD",
        paymentExpiredAt: new Date(Date.now() + 86400000),
        orderItems: [createDefaultOrderItem()],
        customerName: "",
        customerEmail: "",
        customermobile: "",
        offlineTransfer: false,
        collectionDestinationId: undefined,
        externalAccountId: undefined,
        locationId: undefined,
    };
}

export function calculateOrderTotal(items: CreateOrderItemFormValue[] | undefined): number {
    return (items ?? []).reduce((total, item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;

        return total + quantity * unitPrice;
    }, 0);
}

export function formatOrderAmount(currency: OrderCurrency, amount: number): string {
    if (ZERO_DECIMAL_CURRENCIES.has(currency)) {
        return Math.round(amount).toString();
    }

    return amount.toFixed(2);
}

function optionalString(value: string | undefined): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}

function normalizeOrderItems(items: CreateOrderItemFormValue[]): OrderItemRequest[] {
    return items.map((item) => ({
        businessProductId: optionalString(item.businessProductId),
        description: item.description,
        quantity: Number(item.quantity) || 0,
        unitPrice: Number(item.unitPrice) || 0,
    }));
}

function toIsoString(value: Date | DateLikeValue): string {
    if (value instanceof Date) {
        return value.toISOString();
    }

    if (typeof value.toDate === "function") {
        return value.toDate().toISOString();
    }

    if (typeof value.toISOString === "function") {
        return value.toISOString();
    }

    return new Date(value as string | number | Date).toISOString();
}

export function buildCreateOrderPayload(values: CreateOrderFormValues): OrderCreateRequest {
    const totalAmount = calculateOrderTotal(values.orderItems);
    const offlineTransfer = Boolean(values.offlineTransfer);
    const payload: OrderCreateRequest = {
        merchantOrderId: values.merchantOrderId,
        subject: values.subject,
        orderItems: normalizeOrderItems(values.orderItems),
        totalAmount: {
            amount: totalAmount,
            currency: values.currency,
        },
        paymentExpiredAt: toIsoString(values.paymentExpiredAt),
        customerName: optionalString(values.customerName),
        customerEmail: optionalString(values.customerEmail),
        customermobile: optionalString(values.customermobile),
        offlineTransfer,
        locationId: values.locationId,
    };

    if (offlineTransfer) {
        payload.collectionDestinationId = optionalString(values.collectionDestinationId);
    }

    return payload;
}

const ORDER_CURRENCY_SET = new Set<string>(ORDER_CURRENCIES);

function resolveCopyCurrency(currency: string | undefined): OrderCurrency {
    if (currency && ORDER_CURRENCY_SET.has(currency)) {
        return currency as OrderCurrency;
    }
    return "USD";
}

export function buildCopyOrderFormValues(source: OrderView): CreateOrderFormValues {
    const defaults = createDefaultOrderFormValues();
    const items = (source.orderItems ?? [])
        .map((item) => ({
            businessProductId: item.businessProductId ?? "",
            description: item.description ?? "",
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.unitPrice) || 0,
        }))
        .filter((item) => item.description || item.unitPrice || item.quantity);

    return {
        ...defaults,
        merchantOrderId: generateMerchantOrderId(),
        subject: source.subject ?? "",
        currency: resolveCopyCurrency(source.totalAmount?.currency),
        paymentExpiredAt: new Date(Date.now() + 86400000),
        orderItems: items.length > 0 ? items : [createDefaultOrderItem()],
        locationId: source.locationId,
        customerName: "",
        customerEmail: "",
        customermobile: "",
        offlineTransfer: false,
        collectionDestinationId: undefined,
        externalAccountId: undefined,
    };
}
