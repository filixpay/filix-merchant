import type { RiskReviewListItem } from "../shared/contracts";
import { estimateArrayPageTotal, type ReviewListQuery } from "./list-query";
import { fetchRiskReviews } from "../transport/catalog";

export async function listRiskReviews(
    token: string,
    query?: ReviewListQuery,
): Promise<RiskReviewListItem[]> {
    return fetchRiskReviews(token, query);
}

export async function listRiskReviewsPaged(token: string, query: ReviewListQuery) {
    const items = await fetchRiskReviews(token, query);
    return {
        items,
        total: estimateArrayPageTotal(query.page, query.size, items.length),
    };
}
