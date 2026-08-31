import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { WidgetBatchRequest, WidgetBundleDto } from "./types";

export async function loadWidgets(token: string, widgetIds: string[]): Promise<WidgetBundleDto> {
    const body: WidgetBatchRequest = { widgetIds };
    return request<WidgetBundleDto>(ENDPOINTS.PORTAL.REPORTS_WIDGETS, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
