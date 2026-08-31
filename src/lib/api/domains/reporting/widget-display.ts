import type { WidgetResultDto } from "./types";
import type { MerchantWidgetDefinition } from "./widget-registry";

export type WidgetCardView =
    | { visible: false }
    | { visible: true; variant: "value"; displayValue: string }
    | { visible: true; variant: "no_data" }
    | { visible: true; variant: "forbidden" }
    | { visible: true; variant: "failed" };

export function formatWidgetMoney(amount: number, currency: string, locale = "en-US"): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency}`;
    }
}

function readNumericField(data: Record<string, unknown>, field: string): number | null {
    const raw = data[field];
    if (typeof raw === "number" && Number.isFinite(raw)) {
        return raw;
    }
    return null;
}

function formatAvailableValue(widget: WidgetResultDto, meta: MerchantWidgetDefinition): string | null {
    const data = widget.data;
    if (data == null || typeof data !== "object") {
        return null;
    }

    if (meta.format === "money") {
        const amount = readNumericField(data, "amount");
        const currency = typeof data.currency === "string" && data.currency.length > 0 ? data.currency : null;
        if (amount == null || currency == null) {
            return null;
        }
        return formatWidgetMoney(amount, currency);
    }

    const valueField = readNumericField(data, "value");
    if (valueField != null) {
        return String(valueField);
    }

    const amountField = readNumericField(data, "amount");
    if (amountField != null) {
        return String(amountField);
    }

    if (typeof data.value === "string" && data.value.length > 0) {
        return data.value;
    }

    return null;
}

/**
 * Maps WidgetResult contract fields to Widget Bar card view states.
 * Prefers dataAvailability over payload shape; never invents zero for NO_DATA.
 */
export function resolveWidgetCardView(
    widget: WidgetResultDto | undefined,
    meta: MerchantWidgetDefinition,
): WidgetCardView {
    if (!widget || widget.status === "NOT_FOUND") {
        return { visible: false };
    }

    if (widget.status === "FORBIDDEN") {
        return { visible: true, variant: "forbidden" };
    }

    if (widget.status === "FAILED") {
        return { visible: true, variant: "failed" };
    }

    if (widget.status !== "OK") {
        return { visible: false };
    }

    if (widget.dataAvailability === "NO_DATA") {
        return { visible: true, variant: "no_data" };
    }

    if (widget.dataAvailability === "AVAILABLE") {
        const displayValue = formatAvailableValue(widget, meta);
        if (displayValue != null) {
            return { visible: true, variant: "value", displayValue };
        }
        return { visible: true, variant: "no_data" };
    }

    if (widget.data == null) {
        return { visible: true, variant: "no_data" };
    }

    const displayValue = formatAvailableValue(widget, meta);
    if (displayValue != null) {
        return { visible: true, variant: "value", displayValue };
    }

    return { visible: true, variant: "no_data" };
}
