import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import type { RiskRuleDto } from "../shared/dto";
import { mapRiskRuleDto } from "../shared/mappers";

export async function fetchRiskRules(token: string, stage = "PRE_AUTH") {
    const url = `${ENDPOINTS.PORTAL.RISK_RULES}?stage=${encodeURIComponent(stage)}`;
    const items = await request<RiskRuleDto[]>(url, { headers: authHeaders(token) });
    return (items ?? []).map(mapRiskRuleDto);
}
