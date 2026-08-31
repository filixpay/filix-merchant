"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
    Alert,
    Button,
    Card,
    Col,
    Row,
    Skeleton,
    Statistic,
    Table,
    Tag,
    message,
} from "antd";
import { ApartmentOutlined, DownloadOutlined, ShopOutlined } from "@ant-design/icons";
import {
    api,
    ApiError,
    EnterpriseDashboardView,
    EnterpriseTopOrganizationRow,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { getStoredSelectedEnterpriseCode } from "@/components/layout/enterprise-shell";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";

function TrendBars({
    title,
    points,
    emptyLabel,
}: {
    title: string;
    points: { day: string; count: number }[];
    emptyLabel: string;
}) {
    const max = Math.max(1, ...points.map((p) => p.count));
    return (
        <Card title={title} size="small">
            {points.length === 0 ? (
                <div style={{ color: "var(--ant-color-text-secondary)" }}>{emptyLabel}</div>
            ) : (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, minHeight: 120 }}>
                    {points.map((point) => (
                        <div
                            key={point.day}
                            title={`${point.day}: ${point.count}`}
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: 28,
                                    height: `${Math.max(4, (point.count / max) * 88)}px`,
                                    background: "var(--ant-color-primary)",
                                    borderRadius: 4,
                                    opacity: 0.85,
                                }}
                            />
                            <span style={{ fontSize: 10, color: "var(--ant-color-text-secondary)" }}>
                                {point.day.slice(5)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}

export default function EnterpriseDashboardPage() {
    const t = useTranslations("Enterprise.dashboard");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const enterpriseCode = getStoredSelectedEnterpriseCode();

    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const [data, setData] = useState<EnterpriseDashboardView | null>(null);
    const [errorCode, setErrorCode] = useState<string | null>(null);

    const loadDashboard = useCallback(async () => {
        if (!accessToken || !enterpriseCode) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setErrorCode(null);
        try {
            setData(await api.enterprise.dashboard(accessToken, enterpriseCode));
        } catch (err) {
            if (err instanceof ApiError && err.code === "ENTERPRISE_CODE_REQUIRED") {
                setErrorCode(String(err.code));
            } else if (!handleDashboardApiError(err)) {
                setErrorCode(err instanceof ApiError ? String(err.code ?? err.status) : "UNKNOWN");
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken, enterpriseCode]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const handleExport = async () => {
        if (!accessToken || !enterpriseCode) return;
        setExporting(true);
        try {
            const blob = await api.enterprise.exportDashboardCsv(accessToken, enterpriseCode);
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `enterprise-${enterpriseCode}-organizations.csv`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
            message.success(t("export_success"));
        } catch (err) {
            if (err instanceof ApiError) {
                message.error(err.message);
            }
        } finally {
            setExporting(false);
        }
    };

    const activeOrgs = data?.organizationCountByStatus?.ACTIVE ?? 0;
    const suspendedOrgs = data?.organizationCountByStatus?.SUSPENDED ?? 0;
    const orgTrend = data?.organizationCreatedTrend ?? [];
    const merchantTrend = data?.merchantCreatedTrend ?? [];
    const topOrgs = data?.topOrganizationsByMerchantCount ?? [];

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            contentMode="overview"
            extra={
                <Button
                    icon={<DownloadOutlined />}
                    loading={exporting}
                    disabled={!accessToken || !enterpriseCode}
                    onClick={handleExport}
                >
                    {t("export_csv")}
                </Button>
            }
        >
            {errorCode === "ENTERPRISE_CODE_REQUIRED" && (
                <Alert type="warning" showIcon message={t("enterprise_required")} style={{ marginBottom: 16 }} />
            )}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        {loading ? (
                            <Skeleton active paragraph={false} />
                        ) : (
                            <Statistic
                                title={t("active_organizations")}
                                value={activeOrgs}
                                prefix={<ApartmentOutlined />}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        {loading ? (
                            <Skeleton active paragraph={false} />
                        ) : (
                            <Statistic
                                title={t("suspended_organizations")}
                                value={suspendedOrgs}
                                prefix={<ApartmentOutlined />}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        {loading ? (
                            <Skeleton active paragraph={false} />
                        ) : (
                            <Statistic
                                title={t("merchants")}
                                value={data?.merchantCount ?? 0}
                                prefix={<ShopOutlined />}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                    {loading ? (
                        <Card>
                            <Skeleton active />
                        </Card>
                    ) : (
                        <TrendBars
                            title={t("org_created_trend")}
                            points={orgTrend}
                            emptyLabel={t("trend_empty")}
                        />
                    )}
                </Col>
                <Col xs={24} lg={12}>
                    {loading ? (
                        <Card>
                            <Skeleton active />
                        </Card>
                    ) : (
                        <TrendBars
                            title={t("merchant_created_trend")}
                            points={merchantTrend}
                            emptyLabel={t("trend_empty")}
                        />
                    )}
                </Col>
            </Row>

            <Card title={t("top_organizations")} style={{ marginTop: 16 }} size="small">
                <Table<EnterpriseTopOrganizationRow>
                    rowKey={(row) => String(row.organizationCode)}
                    loading={loading}
                    dataSource={topOrgs}
                    pagination={false}
                    locale={{ emptyText: t("top_empty") }}
                    columns={[
                        { title: t("col_name"), dataIndex: "name" },
                        { title: t("col_code"), dataIndex: "organizationCode", width: 120 },
                        {
                            title: t("col_status"),
                            dataIndex: "status",
                            width: 120,
                            render: (status: string) => (
                                <Tag color={status === "ACTIVE" ? "green" : "orange"}>{status}</Tag>
                            ),
                        },
                        {
                            title: t("col_merchant_count"),
                            dataIndex: "merchantCount",
                            width: 140,
                        },
                    ]}
                />
            </Card>

            <Alert
                type="info"
                showIcon
                message={t("read_model_note")}
                style={{ marginTop: 16 }}
            />
        </DashboardPage>
    );
}
