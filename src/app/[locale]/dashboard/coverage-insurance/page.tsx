"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Alert, Button, Card, Checkbox, Descriptions, Modal, Space, Spin, Tag, Typography, message } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, ApiError } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { useMerchantCapabilities } from "@/components/layout/use-merchant-capabilities";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { resolveMerchantCoverageAccess } from "@/lib/coverage/merchant-coverage-access";
import type { CoverageSubscriptionView } from "@/types/coverageSubscription";

type PageState = "loading" | "unavailable" | "not_subscribed" | "subscribed" | "unsubscribed";

export default function CoverageInsurancePage() {
    const t = useTranslations("CoverageInsurance");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const router = useRouter();
    const params = useParams();
    const locale = typeof params.locale === "string" ? params.locale : "en";
    const { activeMerchant } = useMerchantCapabilities(accessToken);
    const { showCoverageInsurance, showCoverageConfig } = useMemo(
        () => resolveMerchantCoverageAccess(activeMerchant),
        [activeMerchant],
    );

    const [pageState, setPageState] = useState<PageState>("loading");
    const [subscription, setSubscription] = useState<CoverageSubscriptionView | null>(null);
    const [agreed, setAgreed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [unsubscribeOpen, setUnsubscribeOpen] = useState(false);

    const reload = useCallback(async () => {
        if (!accessToken) {
            setPageState("loading");
            return;
        }
        setPageState("loading");
        try {
            const view = await api.risk.coverageSubscription.get(accessToken);
            if (!view || view.status === "UNSUBSCRIBED") {
                setSubscription(view);
                setPageState("not_subscribed");
                return;
            }
            setSubscription(view);
            setPageState(view.status === "SUBSCRIBED" ? "subscribed" : "not_subscribed");
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(t("messages.load_failed"));
                setPageState("not_subscribed");
            }
        }
    }, [accessToken, t]);

    useEffect(() => {
        if (!activeMerchant) {
            return;
        }
        if (!showCoverageInsurance) {
            if (showCoverageConfig) {
                router.replace(`/${locale}/dashboard/coverage-config`);
            } else {
                router.replace(`/${locale}/dashboard`);
            }
            return;
        }
        void reload();
    }, [activeMerchant, showCoverageInsurance, showCoverageConfig, locale, reload, router]);

    const handleSubscribe = async () => {
        if (!accessToken || !agreed) {
            return;
        }
        setSubmitting(true);
        try {
            const view = await api.risk.coverageSubscription.subscribe(accessToken, { agreementVersion: "v1" });
            setSubscription(view);
            setPageState("subscribed");
            setAgreed(false);
            message.success(t("messages.subscribed"));
        } catch (err) {
            if (err instanceof ApiError && err.message === "PLATFORM_COVERAGE_NOT_AVAILABLE") {
                setPageState("unavailable");
                return;
            }
            if (!handleDashboardApiError(err)) {
                message.error(t("messages.subscribe_failed"));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnsubscribe = async () => {
        if (!accessToken) {
            return;
        }
        setSubmitting(true);
        try {
            const view = await api.risk.coverageSubscription.unsubscribe(accessToken);
            setSubscription(view);
            setPageState("unsubscribed");
            setUnsubscribeOpen(false);
            message.success(t("messages.unsubscribed"));
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(t("messages.unsubscribe_failed"));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const statusTag = () => {
        if (pageState === "subscribed") {
            return <Tag color="success">{t("status.subscribed")}</Tag>;
        }
        if (pageState === "unsubscribed") {
            return <Tag>{t("status.unsubscribed")}</Tag>;
        }
        return <Tag color="default">{t("status.not_subscribed")}</Tag>;
    };

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")}>
            {pageState === "loading" ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
                    <Spin size="large" />
                </div>
            ) : pageState === "unavailable" ? (
                <Alert type="info" showIcon message={t("unavailable_title")} description={t("unavailable_body")} />
            ) : (
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    <Card>
                        <Space direction="vertical" size={16} style={{ width: "100%" }}>
                            <Space align="center">
                                <SafetyOutlined style={{ fontSize: 28, color: "#1677ff" }} />
                                <div>
                                    <Typography.Title level={4} style={{ margin: 0 }}>
                                        {t("product_title")}
                                    </Typography.Title>
                                    <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                        {t("product_description")}
                                    </Typography.Paragraph>
                                </div>
                                {statusTag()}
                            </Space>

                            {pageState === "subscribed" && subscription ? (
                                <>
                                    <Descriptions column={1} size="small" bordered>
                                        <Descriptions.Item label={t("fields.provider")}>
                                            {subscription.providerType ?? "—"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("fields.subscribed_at")}>
                                            {subscription.subscribedAt ?? "—"}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={t("fields.agreement_version")}>
                                            {subscription.agreementVersion}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <Button danger onClick={() => setUnsubscribeOpen(true)}>
                                        {t("actions.unsubscribe")}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Typography.Paragraph>{t("agreement_body")}</Typography.Paragraph>
                                    <Checkbox checked={agreed} onChange={(event) => setAgreed(event.target.checked)}>
                                        {t("agreement_checkbox")}
                                    </Checkbox>
                                    <Button
                                        type="primary"
                                        disabled={!agreed}
                                        loading={submitting}
                                        onClick={() => void handleSubscribe()}
                                    >
                                        {t("actions.subscribe")}
                                    </Button>
                                </>
                            )}
                        </Space>
                    </Card>

                    {pageState === "unsubscribed" ? (
                        <Alert type="warning" showIcon message={t("unsubscribed_banner")} />
                    ) : null}
                </Space>
            )}

            <Modal
                title={t("unsubscribe_modal.title")}
                open={unsubscribeOpen}
                onCancel={() => setUnsubscribeOpen(false)}
                onOk={() => void handleUnsubscribe()}
                okText={t("unsubscribe_modal.confirm")}
                cancelText={t("unsubscribe_modal.cancel")}
                okButtonProps={{ danger: true, loading: submitting }}
            >
                <Typography.Paragraph>{t("unsubscribe_modal.warning")}</Typography.Paragraph>
            </Modal>
        </DashboardPage>
    );
}
