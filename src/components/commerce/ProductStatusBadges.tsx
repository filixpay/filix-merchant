"use client";

import { Space, Tag, Typography } from "antd";
import { useTranslations } from "next-intl";
import {
    integrationLabelKey,
    isInFlightIntegration,
    presentBusinessStatus,
    type CommerceProductView,
} from "@/lib/api/domains/commerce";

type ProductStatusBadgesProps = {
    product: Pick<CommerceProductView, "businessStatus" | "integrationStatus" | "lastError">;
};

export default function ProductStatusBadges({ product }: ProductStatusBadgesProps) {
    const t = useTranslations("CommerceProducts");
    const business = presentBusinessStatus(product.businessStatus);
    const integrationKey = integrationLabelKey(product.integrationStatus);

    const businessColor =
        business.kind === "legacy"
            ? "default"
            : product.businessStatus === "PUBLISHED"
              ? "green"
              : product.businessStatus === "SUSPENDED"
                ? "orange"
                : "blue";

    const integrationColor =
        product.integrationStatus === "READY"
            ? "success"
            : product.integrationStatus === "FAILED"
              ? "error"
              : isInFlightIntegration(product.integrationStatus)
                ? "processing"
                : "default";

    return (
        <Space direction="vertical" size={2}>
            <Space size={4} wrap>
                <Tag color={businessColor}>{t(business.labelKey)}</Tag>
                <Tag color={integrationColor}>{t(integrationKey)}</Tag>
            </Space>
            {product.integrationStatus === "FAILED" && product.lastError ? (
                <Typography.Text type="danger" style={{ fontSize: 12 }}>
                    {product.lastError}
                </Typography.Text>
            ) : null}
        </Space>
    );
}
