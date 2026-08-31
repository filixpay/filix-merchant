import { fetchFraudEventDetail } from "../transport/catalog";

export async function getFraudEvent(id: string, token: string) {
    return fetchFraudEventDetail(id, token);
}
