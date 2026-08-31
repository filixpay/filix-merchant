import { ENDPOINTS } from "@/lib/api-config";
import { pagedGet } from "../../query";
import type { ListChangeRequestsQuery, MerchantChangeRequestListItem } from "./types";

export async function listChangeRequests(token: string, query: ListChangeRequestsQuery = {}) {
    const params: Record<string, string | number> = {
        page: query.page ?? 0,
        size: query.size ?? 20,
    };
    if (query.changeType) {
        params.changeType = query.changeType;
    }
    if (query.status) {
        params.status = query.status;
    }
    return pagedGet<MerchantChangeRequestListItem>(
        ENDPOINTS.PORTAL.MERCHANT_CHANGE_REQUESTS,
        params,
        token,
    );
}
