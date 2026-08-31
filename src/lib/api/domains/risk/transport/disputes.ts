import { ENDPOINTS, API_BASE_URL } from "@/lib/api-config";
import { authHeaders, request } from "@/lib/api/core";
import {
    buildPortalHeaders,
    resolveClientOrganizationCode,
    resolveClientSelectedGroup,
} from "@/lib/api/portal-headers";
import { pagedGet } from "@/lib/api/query";
import type { DisputeDto, EvidenceDto } from "../shared/dto";
import { mapDisputeDto, mapDisputeListItem, mapEvidenceDto } from "../shared/mappers";
import type { DisputeOperationalSummary, SaveDraftRequest } from "../shared/contracts";
import { isDueSoon, isOverdue, requiresMerchantAction } from "../shared/priority";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import {
    buildDisputeSearchParams,
    type DisputeListQuery,
} from "../disputes/list-query";

function buildSummaryFromItems(items: ReturnType<typeof mapDisputeListItem>[]): DisputeOperationalSummary {
    const actionable = items.filter((d) => requiresMerchantAction(d.status));
    return {
        actionRequired: actionable.length,
        dueSoon: actionable.filter(
            (d) => isDueSoon(d.responseDueAt) && !isOverdue(d.responseDueAt),
        ).length,
        overdue: actionable.filter((d) => isOverdue(d.responseDueAt)).length,
    };
}

export async function fetchDisputes(token: string, query: DisputeListQuery) {
    const response = await pagedGet<DisputeDto>(
        ENDPOINTS.PORTAL.RISK_DISPUTES,
        buildDisputeSearchParams(query),
        token,
    );
    const { items, total } = normalizePagedResponse(response);
    const mapped = items.map(mapDisputeListItem);
    const summary = buildSummaryFromItems(mapped);
    return { items: mapped, total, summary };
}

export async function fetchDispute(id: string, token: string) {
    const dto = await request<DisputeDto>(`${ENDPOINTS.PORTAL.RISK_DISPUTES}/${id}`, {
        headers: authHeaders(token),
    });
    return mapDisputeDto(dto);
}

export async function postSaveDraft(id: string, payload: SaveDraftRequest, token: string) {
    const dto = await request<DisputeDto>(`${ENDPOINTS.PORTAL.RISK_DISPUTES}/${id}/draft`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: authHeaders(token),
    });
    return mapDisputeDto(dto);
}

export async function postSubmitEvidence(id: string, payload: SaveDraftRequest, token: string) {
    const dto = await request<DisputeDto>(`${ENDPOINTS.PORTAL.RISK_DISPUTES}/${id}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: authHeaders(token),
    });
    return mapDisputeDto(dto);
}

export async function postAcceptLiability(id: string, token: string) {
    const dto = await request<DisputeDto>(`${ENDPOINTS.PORTAL.RISK_DISPUTES}/${id}/accept-liability`, {
        method: "POST",
        headers: authHeaders(token),
    });
    return mapDisputeDto(dto);
}

export async function uploadDisputeEvidenceFile(
    disputeId: string,
    file: File,
    category: string,
    token: string,
) {
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);

    const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.PORTAL.RISK_DISPUTES}/${disputeId}/evidence`,
        {
            method: "POST",
            headers: buildPortalHeaders({
                token,
                selectedGroup: resolveClientSelectedGroup(),
                organizationCode: resolveClientOrganizationCode(),
                contentType: false,
            }),
            body: form,
        },
    );

    let payload: { data?: EvidenceDto; message?: string; code?: string | number };
    try {
        payload = await response.json();
    } catch {
        throw new Error(`Evidence upload failed (${response.status})`);
    }

    if (!response.ok) {
        throw new Error(payload.message ?? `Evidence upload failed (${response.status})`);
    }

    const evidence = payload.data;
    if (!evidence) {
        throw new Error("Evidence upload returned empty payload");
    }

    return mapEvidenceDto(evidence);
}
