import { isInFlightIntegration } from "./presenters";
import type { CommerceProductView } from "./types";

export type ProductListStatusFilter = "all" | "published" | "suspended" | "draft" | "syncing";

export type ProductListFilters = {
  query: string;
  categoryId: string | null;
  status: ProductListStatusFilter;
};

export function matchesProductListFilters(
  product: CommerceProductView,
  filters: ProductListFilters,
): boolean {
  if (filters.categoryId && product.categoryId !== filters.categoryId) {
    return false;
  }

  const q = filters.query.trim().toLowerCase();
  if (q) {
    const inTitle = product.title.toLowerCase().includes(q);
    const inSku = product.sku.toLowerCase().includes(q);
    if (!inTitle && !inSku) {
      return false;
    }
  }

  switch (filters.status) {
    case "published":
      return product.businessStatus === "PUBLISHED" && product.integrationStatus === "READY";
    case "suspended":
      return product.businessStatus === "SUSPENDED";
    case "draft":
      return product.businessStatus === "DRAFT";
    case "syncing":
      return isInFlightIntegration(product.integrationStatus);
    default:
      return true;
  }
}

export type ProductListStatusTone = "success" | "default" | "warning" | "processing" | "error";

export function presentProductListStatus(
  product: Pick<CommerceProductView, "businessStatus" | "integrationStatus">,
): { labelKey: string; tone: ProductListStatusTone } {
  if (isInFlightIntegration(product.integrationStatus)) {
    return { labelKey: "listStatus.syncing", tone: "processing" };
  }
  if (product.integrationStatus === "FAILED") {
    return { labelKey: "listStatus.sync_failed", tone: "error" };
  }
  if (product.businessStatus === "PUBLISHED" && product.integrationStatus === "READY") {
    return { labelKey: "listStatus.live", tone: "success" };
  }
  if (product.businessStatus === "SUSPENDED") {
    return { labelKey: "listStatus.suspended", tone: "default" };
  }
  if (product.businessStatus === "DRAFT") {
    return { labelKey: "listStatus.draft", tone: "warning" };
  }
  return { labelKey: "listStatus.needs_attention", tone: "warning" };
}
