import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { ApiError, type ApiResponse } from "../../core";
import {
    buildPortalHeaders,
    resolveClientOrganizationCode,
    resolveClientSelectedGroup,
} from "../../portal-headers";
import type { ApplicationDocument } from "./types";

export async function uploadApplicationDocument(
    token: string,
    applicationId: string,
    fieldCode: string,
    file: File,
    selectedGroup?: string,
): Promise<ApplicationDocument> {
    const form = new FormData();
    form.append("file", file);

    const response = await fetch(
        `${API_BASE_URL}${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${applicationId}/documents/${fieldCode}`,
        {
            method: "POST",
            headers: buildPortalHeaders({
                token,
                selectedGroup: selectedGroup ?? resolveClientSelectedGroup(),
                organizationCode: resolveClientOrganizationCode(),
                contentType: false,
            }),
            body: form,
        },
    );

    let payload: ApiResponse<ApplicationDocument>;
    try {
        payload = (await response.json()) as ApiResponse<ApplicationDocument>;
    } catch {
        throw new Error(`Document upload failed (${response.status})`);
    }

    if (!response.ok || payload.success === false || (payload.code !== 0 && payload.code !== "SUCCESS")) {
        throw new ApiError(
            payload.message ?? `Document upload failed (${response.status})`,
            response.status,
            payload.code,
        );
    }

    if (!payload.data) {
        throw new Error("Document upload returned empty payload");
    }

    return payload.data;
}
