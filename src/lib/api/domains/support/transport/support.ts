import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import { pagedGet } from "@/lib/api/query";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import type {
    CreateSupportConversationRequest,
    SupportConversation,
    SupportListQuery,
    SupportMessage,
} from "../shared/contracts";

function buildListParams(query: SupportListQuery): Record<string, string | number> {
    const params: Record<string, string | number> = {
        page: query.page,
        size: query.size,
    };
    if (query.status) {
        params.status = query.status;
    }
    return params;
}

export async function fetchSupportConversations(token: string, query: SupportListQuery) {
    const response = await pagedGet<SupportConversation>(
        ENDPOINTS.PORTAL.SUPPORT_CONVERSATIONS,
        buildListParams(query),
        token,
    );
    const { items, total } = normalizePagedResponse(response);
    return { items, total };
}

export async function fetchSupportConversation(token: string, conversationId: string) {
    return request<SupportConversation>(ENDPOINTS.PORTAL.SUPPORT_CONVERSATION(conversationId), {
        headers: authHeaders(token),
    });
}

export async function fetchSupportMessages(token: string, conversationId: string) {
    return request<SupportMessage[]>(ENDPOINTS.PORTAL.SUPPORT_MESSAGES(conversationId), {
        headers: authHeaders(token),
    });
}

export async function createSupportConversation(
    token: string,
    body: CreateSupportConversationRequest,
) {
    return request<SupportConversation>(ENDPOINTS.PORTAL.SUPPORT_CONVERSATIONS, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify(body),
    });
}
