import { normalizeStorefrontUrl } from "@/lib/commerce/storefront-url";
import type {
    CommerceCategoryDto,
    CommerceCategoryView,
    CommerceProductDto,
    CommerceProductTypeDto,
    CommerceProductTypeView,
    CommerceProductView,
} from "./types";

export function mapCommerceProductDto(dto: CommerceProductDto): CommerceProductView {
    const priceRaw = dto.price;
    const price =
        priceRaw === undefined || priceRaw === null || priceRaw === ""
            ? null
            : typeof priceRaw === "number"
              ? priceRaw
              : Number(priceRaw);

    return {
        id: dto.id,
        title: dto.title ?? "",
        description: dto.description ?? "",
        categoryId: dto.categoryId ?? "",
        productTypeId: dto.productTypeId,
        sku: dto.sku ?? "",
        price: Number.isFinite(price) ? price : null,
        stock: dto.stock ?? 0,
        images: dto.images ?? [],
        businessStatus: dto.businessStatus ?? "DRAFT",
        integrationStatus: dto.integrationStatus ?? "CREATING",
        externalProductId: dto.externalProductId,
        storefrontUrl: normalizeStorefrontUrl(dto.storefrontUrl),
        lastError: dto.lastError,
        lastErrorCode: dto.lastErrorCode,
        version: dto.version,
        updatedAt: dto.updatedAt,
    };
}

export function mapCommerceCategoryDto(dto: CommerceCategoryDto): CommerceCategoryView {
    return {
        id: dto.id,
        name: dto.name,
        slug: dto.slug ?? "",
        parentId: dto.parentId ?? null,
    };
}

export function mapCommerceProductTypeDto(dto: CommerceProductTypeDto): CommerceProductTypeView {
    return {
        id: dto.id,
        name: dto.name,
    };
}
