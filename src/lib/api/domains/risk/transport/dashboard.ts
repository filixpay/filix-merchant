import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import type { DashboardDto } from "../shared/dto";
import { mapDashboardDto } from "../shared/mappers";

export async function fetchRiskDashboard(token: string) {
    const dto = await request<DashboardDto>(ENDPOINTS.PORTAL.RISK_DASHBOARD, {
        headers: authHeaders(token),
    });
    return mapDashboardDto(dto);
}
