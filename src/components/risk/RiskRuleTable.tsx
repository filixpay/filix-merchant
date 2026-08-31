"use client";

import { Switch, Table, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { RiskRuleView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import { getPriorityColor } from "@/components/disputes/dispute-model";

interface RiskRuleTableProps {
    rules: RiskRuleView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
}

function formatRuleConfigSummary(
    config: string,
    configSchema: string,
    t: ReturnType<typeof useTranslations<"RiskRules">>,
): string {
    try {
        const parsed = JSON.parse(config) as Record<string, unknown>;
        if (configSchema === "velocity.v1") {
            return t("config.velocity", {
                maxCount: String(parsed.maxCount ?? "-"),
                windowMinutes: String(parsed.windowMinutes ?? "-"),
            });
        }
        if (configSchema === "amount.v1") {
            return t("config.amount", {
                threshold: String(parsed.threshold ?? "-"),
            });
        }
    } catch {
        // fall through to raw config
    }
    return config;
}

export default function RiskRuleTable({
    rules,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
}: RiskRuleTableProps) {
    const t = useTranslations("RiskRules");
    const { locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: rules.length,
        emptyDescription: t("empty"),
        onRetry,
    });

    const columns: ColumnsType<RiskRuleView> = [
        {
            title: t("headers.name"),
            dataIndex: "name",
            key: "name",
        },
        {
            title: t("headers.rule_type"),
            dataIndex: "ruleType",
            key: "ruleType",
            render: (value: string) => t(`rule_type.${value}`, { defaultValue: value }),
        },
        {
            title: t("headers.severity"),
            dataIndex: "severity",
            key: "severity",
            render: (severity) => <Tag color={getPriorityColor(severity)}>{severity}</Tag>,
        },
        {
            title: t("headers.enforcement"),
            dataIndex: "enforcement",
            key: "enforcement",
            render: (value: string) => t(`enforcement.${value}`, { defaultValue: value }),
        },
        {
            title: t("headers.scope"),
            dataIndex: "platformRule",
            key: "scope",
            render: (_, row) => (row.platformRule ? t("scope.platform") : t("scope.merchant")),
        },
        {
            title: t("headers.enabled"),
            dataIndex: "enabled",
            key: "enabled",
            render: (enabled: boolean) => <Switch checked={enabled} disabled />,
        },
        {
            title: t("headers.priority"),
            dataIndex: "priority",
            key: "priority",
        },
    ];

    return (
        <>
            {refreshBanner}
            <Table<RiskRuleView>
                rowKey="id"
                columns={columns}
                dataSource={rules}
                loading={loading || isRefreshing}
                pagination={false}
                locale={tableLocale}
                expandable={{
                    expandedRowRender: (row) => (
                        <Typography.Paragraph style={{ marginBottom: 0 }}>
                            <Typography.Text type="secondary">{t("headers.config")}: </Typography.Text>
                            {formatRuleConfigSummary(row.config, row.configSchema, t)}
                            <br />
                            <Typography.Text type="secondary">{t("config.schema")}: </Typography.Text>
                            {row.configSchema}
                        </Typography.Paragraph>
                    ),
                }}
            />
        </>
    );
}
