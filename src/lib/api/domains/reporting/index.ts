import { exportReport } from "./export-report";
import { queryReport } from "./query";
import { loadWidgets } from "./widgets";

export const reportingApi = {
    query: queryReport,
    export: exportReport,
    widgets: loadWidgets,
};

export type {
    WidgetDataAvailability,
    WidgetStatus,
    WidgetResultDto,
    WidgetBundleDto,
    ReportingApiVersion,
    ReportDomain,
    ReportView,
    ReportQueryRequest,
    ReportExportRequest,
    WidgetBatchRequest,
    ReportPageDto,
    TransactionReportRow,
    TransactionReportDetail,
    TransactionTimelineItem,
    TransactionTimeline,
    WidgetNumericResolution,
} from "./types";
export { resolveWidgetNumericValue } from "./types";
export {
    MERCHANT_WIDGETS,
    MERCHANT_WIDGET_IDS,
    reportingTitleKey,
} from "./widget-registry";
export type { MerchantWidgetDefinition, MerchantWidgetId, WidgetFormat } from "./widget-registry";
export { resolveWidgetCardView, formatWidgetMoney } from "./widget-display";
export type { WidgetCardView } from "./widget-display";
