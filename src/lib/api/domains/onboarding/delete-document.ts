import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";

export async function deleteApplicationDocument(
    token: string,
    applicationId: string,
    fieldCode: string,
): Promise<void> {
    await request<void>(
        `${ENDPOINTS.PORTAL.MERCHANT_APPLICATIONS}/${applicationId}/documents/${fieldCode}`,
        {
            method: "DELETE",
            headers: authHeaders(token),
        },
    );
}
