import type { DisputeOperationalSummary, DisputeListItem } from "../shared/contracts";
import type { DisputeListQuery } from "./list-query";
import * as live from "../transport/disputes";

export async function listDisputes(
    token: string,
    query: DisputeListQuery,
): Promise<{
    items: DisputeListItem[];
    total: number;
    summary: DisputeOperationalSummary;
}> {
    return live.fetchDisputes(token, query);
}

export async function getDispute(id: string, token: string) {
    return live.fetchDispute(id, token);
}
