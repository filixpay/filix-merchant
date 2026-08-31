import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import { mapCommerceProductTypeDto } from "./mappers";
import type { CommerceProductTypeDto, CommerceProductTypeView } from "./types";

export async function listProductTypes(token: string): Promise<CommerceProductTypeView[]> {
    const rows = await request<CommerceProductTypeDto[]>(ENDPOINTS.PORTAL.COMMERCE_PRODUCT_TYPES, {
        headers: authHeaders(token),
    });
    return (rows ?? []).map(mapCommerceProductTypeDto);
}
