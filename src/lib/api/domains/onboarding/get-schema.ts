import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { ApplicationMerchantType, ApplicationSchemaDto } from "./types";

export async function getApplicationSchema(
    token: string,
    registrationCountry: string,
    merchantType: ApplicationMerchantType,
): Promise<ApplicationSchemaDto> {
    const query = new URLSearchParams({
        registrationCountry,
        merchantType,
    });
    return request<ApplicationSchemaDto>(
        `${ENDPOINTS.PORTAL.APPLICATION_SCHEMAS}?${query.toString()}`,
        { headers: authHeaders(token) },
    );
}
