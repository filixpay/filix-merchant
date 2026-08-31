import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import { buildQuery } from "../../query";
import { mapCommerceProductDto } from "./mappers";
import type {
    CommerceProductDto,
    CommerceProductListQuery,
    CommerceProductView,
    CreateCommerceProductBody,
    UpdateCommerceProductBody,
} from "./types";

function productsBase(): string {
    return ENDPOINTS.PORTAL.COMMERCE_PRODUCTS;
}

export async function listProducts(token: string, query: CommerceProductListQuery): Promise<CommerceProductView[]> {
    const qs = buildQuery({ page: query.page, size: query.size });
    const rows = await request<CommerceProductDto[]>(`${productsBase()}?${qs}`, {
        headers: authHeaders(token),
    });
    return (rows ?? []).map(mapCommerceProductDto);
}

export async function getProduct(token: string, id: string): Promise<CommerceProductView> {
    const dto = await request<CommerceProductDto>(`${productsBase()}/${encodeURIComponent(id)}`, {
        headers: authHeaders(token),
    });
    return mapCommerceProductDto(dto);
}

export async function createProduct(token: string, body: CreateCommerceProductBody): Promise<CommerceProductView> {
    const dto = await request<CommerceProductDto>(productsBase(), {
        method: "POST",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    return mapCommerceProductDto(dto);
}

export async function updateProduct(
    token: string,
    id: string,
    body: UpdateCommerceProductBody,
): Promise<CommerceProductView> {
    const dto = await request<CommerceProductDto>(`${productsBase()}/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
            ...authHeaders(token),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    return mapCommerceProductDto(dto);
}

export async function publishProduct(token: string, id: string): Promise<CommerceProductView> {
    const dto = await request<CommerceProductDto>(`${productsBase()}/${encodeURIComponent(id)}/publish`, {
        method: "POST",
        headers: authHeaders(token),
    });
    return mapCommerceProductDto(dto);
}

export async function unpublishProduct(token: string, id: string): Promise<CommerceProductView> {
    const dto = await request<CommerceProductDto>(`${productsBase()}/${encodeURIComponent(id)}/unpublish`, {
        method: "POST",
        headers: authHeaders(token),
    });
    return mapCommerceProductDto(dto);
}

export async function retrySyncProduct(token: string, id: string): Promise<CommerceProductView> {
    const dto = await request<CommerceProductDto>(`${productsBase()}/${encodeURIComponent(id)}/retry-sync`, {
        method: "POST",
        headers: authHeaders(token),
    });
    return mapCommerceProductDto(dto);
}

export async function deleteProduct(token: string, id: string): Promise<void> {
    await request<null>(`${productsBase()}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(token),
    });
}
