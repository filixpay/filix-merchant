import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import { mapCommerceCategoryDto } from "./mappers";
import type { CommerceCategoryDto, CommerceCategoryView } from "./types";

export async function listCategories(token: string): Promise<CommerceCategoryView[]> {
    const rows = await request<CommerceCategoryDto[]>(ENDPOINTS.PORTAL.COMMERCE_CATEGORIES, {
        headers: authHeaders(token),
    });
    return (rows ?? []).map(mapCommerceCategoryDto);
}
