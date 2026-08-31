import type { FraudEventListItem } from "../shared/contracts";
import { estimateArrayPageTotal, type FraudListQuery } from "./list-query";
import { fetchFraudEvents } from "../transport/catalog";

export async function listFraudEvents(
    token: string,
    query?: FraudListQuery,
): Promise<FraudEventListItem[]> {
    return fetchFraudEvents(token, query);
}

export async function listFraudEventsPaged(token: string, query: FraudListQuery) {
    const items = await fetchFraudEvents(token, query);
    return {
        items,
        total: estimateArrayPageTotal(query.page, query.size, items.length),
    };
}
