export type CommerceProductBusinessStatus = "DRAFT" | "PUBLISHED" | "SUSPENDED";
export type CommerceIntegrationStatus = "CREATING" | "SYNCING" | "READY" | "FAILED";

/** Wire DTO from filix-pay CommerceProductResponse. */
export interface CommerceProductDto {
    id: string;
    merchantId?: string;
    title: string;
    description?: string;
    categoryId?: string;
    productTypeId?: string;
    sku?: string;
    price?: number | string;
    stock?: number;
    images?: string[];
    businessStatus: string;
    integrationStatus: string;
    rejectionReason?: string;
    clientRequestId?: string;
    version?: number;
    externalProductId?: string;
    storefrontUrl?: string | null;
    lastError?: string;
    lastErrorCode?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    suspendedAt?: string;
}

export interface CommerceProductView {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    productTypeId?: string;
    sku: string;
    price: number | null;
    stock: number;
    images: string[];
    businessStatus: string;
    integrationStatus: string;
    externalProductId?: string;
    storefrontUrl?: string | null;
    lastError?: string;
    lastErrorCode?: string;
    version?: number;
    updatedAt?: string;
}

export interface CommerceCategoryDto {
    id: string;
    name: string;
    slug?: string;
    parentId?: string | null;
}

export interface CommerceCategoryView {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
}

export interface CommerceProductTypeDto {
    id: string;
    name: string;
}

export interface CommerceProductTypeView {
    id: string;
    name: string;
}

export interface CommerceMediaUploadDto {
    url: string;
    contentType: string;
    sizeBytes: number;
}

export interface CreateCommerceProductBody {
    title: string;
    description?: string;
    categoryId: string;
    productTypeId?: string;
    sku: string;
    price: number;
    stock: number;
    images: string[];
    clientRequestId: string;
}

export interface UpdateCommerceProductBody {
    title: string;
    description?: string;
    categoryId: string;
    productTypeId?: string;
    sku: string;
    price: number;
    stock: number;
    images: string[];
}

export interface CommerceProductListQuery {
    page: number;
    size: number;
}
