"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button, Card, Space, Steps, Typography } from "antd";
import { CheckCircleOutlined, LockOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import type { CommerceActivationStatus } from "@/lib/api/domains/commerce/activation";

type CommerceActivationCardProps = {
    status: CommerceActivationStatus;
    pollingTimedOut: boolean;
    onRefresh: () => void;
};

function productDetailHref(locale: string, productId: string | null): string {
    if (productId) {
        return `/${locale}/dashboard/commerce/products/${encodeURIComponent(productId)}`;
    }
    return `/${locale}/dashboard/commerce/products`;
}

function createProductHref(locale: string): string {
    return `/${locale}/dashboard/commerce/products/new`;
}

function profileHref(locale: string): string {
    return `/${locale}/dashboard/maintenance/profile`;
}

export default function CommerceActivationCard({
    status,
    pollingTimedOut,
    onRefresh,
}: CommerceActivationCardProps) {
    const t = useTranslations("CommerceActivation");
    const locale = useLocale();

    if (status.phase === "ACTIVATED") {
        return null;
    }

    const profileDone = status.profileComplete;

    let cta: ReactNode = null;
    switch (status.phase) {
        case "NO_PRODUCTS":
            cta = (
                <Link href={createProductHref(locale)}>
                    <Button type="primary">{t("cta.publish_first")}</Button>
                </Link>
            );
            break;
        case "HAS_DRAFT":
            cta = (
                <Link href={productDetailHref(locale, status.activationProductId)}>
                    <Button type="primary">{t("cta.continue_publish")}</Button>
                </Link>
            );
            break;
        case "PUBLISHING":
            cta = (
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    <Button type="primary" disabled loading>
                        {t("cta.syncing")}
                    </Button>
                    {pollingTimedOut ? (
                        <Space wrap>
                            <Typography.Text type="secondary">{t("timeout.message")}</Typography.Text>
                            <Button size="small" onClick={onRefresh}>
                                {t("timeout.refresh")}
                            </Button>
                        </Space>
                    ) : null}
                </Space>
            );
            break;
        case "PUBLISH_FAILED":
            cta = (
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                    {status.publishError ? (
                        <Typography.Text type="danger">{status.publishError}</Typography.Text>
                    ) : (
                        <Typography.Text type="danger">{t("failed.fallback")}</Typography.Text>
                    )}
                    <Link href={productDetailHref(locale, status.activationProductId)}>
                        <Button type="primary">{t("cta.retry_publish")}</Button>
                    </Link>
                </Space>
            );
            break;
        default:
            cta = null;
    }

    return (
        <Card style={{ marginBottom: 16 }}>
            <Typography.Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
                {t("title")}
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
                {t("subtitle")}
            </Typography.Paragraph>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 16 }}>
                {t("trust")}
            </Typography.Paragraph>

            <Steps
                direction="vertical"
                size="small"
                current={profileDone ? 1 : 0}
                items={[
                    {
                        title: t("steps.profile"),
                        status: profileDone ? "finish" : "process",
                        icon: profileDone ? <CheckCircleOutlined /> : undefined,
                        description: profileDone ? null : (
                            <Link href={profileHref(locale)}>{t("steps.profile_link")}</Link>
                        ),
                    },
                    {
                        title: t("steps.publish"),
                        status: "process",
                        description: status.activationProductName ? (
                            <Typography.Text type="secondary">{status.activationProductName}</Typography.Text>
                        ) : null,
                    },
                    {
                        title: t("steps.orders"),
                        status: "wait",
                        icon: <LockOutlined />,
                    },
                ]}
                style={{ marginBottom: 16 }}
            />

            {cta}
        </Card>
    );
}
