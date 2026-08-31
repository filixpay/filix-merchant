"use client";

import { Tag } from "antd";
import { useTranslations } from "next-intl";
import {
  presentProductListStatus,
  type ProductListStatusTone,
} from "@/lib/api/domains/commerce/product-list-filters";
import type { CommerceProductView } from "@/lib/api/domains/commerce";

type ProductListStatusBadgeProps = {
  product: Pick<CommerceProductView, "businessStatus" | "integrationStatus">;
};

function toneToColor(tone: ProductListStatusTone): string {
  switch (tone) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "processing":
      return "processing";
    case "error":
      return "error";
    default:
      return "default";
  }
}

export default function ProductListStatusBadge({ product }: ProductListStatusBadgeProps) {
  const t = useTranslations("CommerceProducts");
  const { labelKey, tone } = presentProductListStatus(product);
  return <Tag color={toneToColor(tone)}>{t(labelKey)}</Tag>;
}
