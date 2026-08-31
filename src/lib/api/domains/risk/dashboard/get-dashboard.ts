import { fetchRiskDashboard } from "../transport/dashboard";

export async function getRiskDashboard(token: string) {
    return fetchRiskDashboard(token);
}
