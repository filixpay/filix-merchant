import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import { ApiError, type ApiResponse } from "../../core";
import { buildPortalHeaders, resolveClientOrganizationCode, resolveClientSelectedGroup } from "../../portal-headers";
import type { CommerceMediaUploadDto } from "./types";

export async function uploadCommerceMedia(token: string, file: File): Promise<CommerceMediaUploadDto> {
    const form = new FormData();
    form.append("file", file);

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PORTAL.COMMERCE_MEDIA}`, {
        method: "POST",
        headers: buildPortalHeaders({
            token,
            selectedGroup: resolveClientSelectedGroup(),
            organizationCode: resolveClientOrganizationCode(),
            contentType: false,
        }),
        body: form,
    });

    let payload: ApiResponse<CommerceMediaUploadDto>;
    try {
        payload = (await response.json()) as ApiResponse<CommerceMediaUploadDto>;
    } catch {
        throw new Error(`Media upload failed (${response.status})`);
    }

    if (!response.ok || payload.success === false || (payload.code !== 0 && payload.code !== "SUCCESS")) {
        throw new ApiError(
            payload.message ?? `Media upload failed (${response.status})`,
            response.status,
            payload.code,
        );
    }

    if (!payload.data?.url) {
        throw new Error("Media upload returned empty URL");
    }

    return payload.data;
}
