import { fetchReviewDetail } from "../transport/catalog";

export async function getRiskReview(id: string, token: string) {
    return fetchReviewDetail(id, token);
}
