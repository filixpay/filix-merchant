export type WidgetFormat = "money" | "none";

export type MerchantWidgetDefinition = {
    id: string;
    titleKey: string;
    format: WidgetFormat;
};

export const MERCHANT_WIDGETS = [
    {
        id: "AVAILABLE_BALANCE",
        titleKey: "reporting.widgets.availableBalance",
        format: "money",
    },
    {
        id: "TODAY_VOLUME",
        titleKey: "reporting.widgets.todayVolume",
        format: "none",
    },
    {
        id: "SUCCESS_RATE",
        titleKey: "reporting.widgets.successRate",
        format: "none",
    },
    {
        id: "PENDING_SETTLEMENT",
        titleKey: "reporting.widgets.pendingSettlement",
        format: "none",
    },
] as const satisfies readonly MerchantWidgetDefinition[];

export type MerchantWidgetId = (typeof MERCHANT_WIDGETS)[number]["id"];

export const MERCHANT_WIDGET_IDS: MerchantWidgetId[] = MERCHANT_WIDGETS.map((widget) => widget.id);

export function reportingTitleKey(titleKey: string): string {
    return titleKey.startsWith("reporting.") ? titleKey.slice("reporting.".length) : titleKey;
}
