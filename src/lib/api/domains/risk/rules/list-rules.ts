import type { RiskRuleView } from "../shared/contracts";
import { fetchRiskRules } from "../transport/rules";

export async function listRiskRules(token: string, stage = "PRE_AUTH"): Promise<RiskRuleView[]> {
    return fetchRiskRules(token, stage);
}
