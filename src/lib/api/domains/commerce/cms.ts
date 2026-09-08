import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import { buildQuery } from "../../query";

export type CmsEntityType =
  | "HERITAGE"
  | "GEOGRAPHICAL_INDICATION"
  | "BRAND"
  | "FOOD"
  | "TOPIC";

export const CMS_ENTITY_TYPES: CmsEntityType[] = [
  "HERITAGE",
  "GEOGRAPHICAL_INDICATION",
  "BRAND",
  "FOOD",
  "TOPIC",
];

export interface CmsEntitySummary {
  type: CmsEntityType | string;
  id: string;
  title?: string;
  slug?: string;
  summary?: string;
  url?: string;
  locale?: string;
}

export interface CmsLinkRef {
  type: CmsEntityType | string;
  id: string;
}

export interface ProductCmsLinksPayload {
  links: CmsEntitySummary[];
  degraded?: boolean;
}

export interface CreateProductWithCmsResult {
  product: import("./types").CommerceProductView;
  cmsLinksApplied: boolean;
  cmsLinksApplyReason?: string | null;
}

export async function searchCmsEntities(
  token: string,
  params: { type: CmsEntityType; q?: string; page?: number; size?: number; locale?: string },
): Promise<CmsEntitySummary[]> {
  const qs = buildQuery({
    type: params.type,
    q: params.q,
    page: params.page ?? 0,
    size: params.size ?? 20,
    locale: params.locale,
  });
  return request<CmsEntitySummary[]>(`${ENDPOINTS.PORTAL.CMS_ENTITIES}?${qs}`, {
    headers: authHeaders(token),
  });
}

export async function getProductCmsLinks(
  token: string,
  productId: string,
  locale?: string,
): Promise<ProductCmsLinksPayload> {
  const qs = buildQuery({ locale });
  const path = `${ENDPOINTS.PORTAL.COMMERCE_PRODUCTS}/${encodeURIComponent(productId)}/cms-links${qs ? `?${qs}` : ""}`;
  return request<ProductCmsLinksPayload>(path, { headers: authHeaders(token) });
}

export async function replaceProductCmsLinks(
  token: string,
  productId: string,
  links: CmsLinkRef[],
): Promise<ProductCmsLinksPayload> {
  return request<ProductCmsLinksPayload>(
    `${ENDPOINTS.PORTAL.COMMERCE_PRODUCTS}/${encodeURIComponent(productId)}/cms-links`,
    {
      method: "PUT",
      headers: {
        ...authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ links }),
    },
  );
}
