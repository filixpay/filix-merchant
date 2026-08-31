"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, Form, Input, Select, Space, Table, Tag, message } from "antd";
import {
    api,
    ApiError,
    EnterpriseAuditLogItem,
    EnterpriseAuditLogPage,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import { getStoredSelectedEnterpriseCode } from "@/components/layout/enterprise-shell";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";

const ACTION_OPTIONS = [
    "enterprise.organization.created",
    "enterprise.organization.suspended",
    "enterprise.organization.activated",
    "enterprise.member.added",
    "enterprise.member.suspended",
    "enterprise.member.removed",
    "enterprise.member.kind_changed",
] as const;

export default function EnterpriseAuditPage() {
    const t = useTranslations("Enterprise.audit");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const enterpriseCode = getStoredSelectedEnterpriseCode();

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<EnterpriseAuditLogPage>({
        items: [],
        page: 0,
        size: 20,
        totalElements: 0,
    });
    const [form] = Form.useForm<{
        organizationCode?: string;
        action?: string;
    }>();

    const loadAudit = useCallback(
        async (pageIndex = 0) => {
            if (!accessToken || !enterpriseCode) {
                setLoading(false);
                return;
            }
            const values = form.getFieldsValue();
            setLoading(true);
            try {
                const result = await api.enterprise.listAudit(
                    accessToken,
                    {
                        organizationCode: values.organizationCode?.trim() || undefined,
                        action: values.action || undefined,
                        page: pageIndex,
                        size: 20,
                    },
                    enterpriseCode,
                );
                setPage(result);
            } catch (err) {
                if (err instanceof ApiError) {
                    message.error(err.message);
                } else {
                    handleDashboardApiError(err);
                }
            } finally {
                setLoading(false);
            }
        },
        [accessToken, enterpriseCode, form],
    );

    useEffect(() => {
        loadAudit(0);
    }, [loadAudit]);

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="table">
            <Form
                form={form}
                layout="inline"
                style={{ marginBottom: 16, rowGap: 8 }}
                onFinish={() => loadAudit(0)}
            >
                <Form.Item name="organizationCode" label={t("filter_organization_code")}>
                    <Input allowClear style={{ width: 160 }} placeholder={t("filter_organization_code")} />
                </Form.Item>
                <Form.Item name="action" label={t("filter_action")}>
                    <Select
                        allowClear
                        style={{ width: 280 }}
                        options={ACTION_OPTIONS.map((value) => ({
                            value,
                            label: t(`actions.${value}`),
                        }))}
                        placeholder={t("filter_action_all")}
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {t("search")}
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                loadAudit(0);
                            }}
                        >
                            {t("reset")}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>

            <Table<EnterpriseAuditLogItem>
                rowKey="eventId"
                loading={loading}
                dataSource={page.items}
                pagination={{
                    current: (page.page ?? 0) + 1,
                    pageSize: page.size || 20,
                    total: page.totalElements,
                    showSizeChanger: false,
                    onChange: (next) => loadAudit(next - 1),
                }}
                columns={[
                    {
                        title: t("col_time"),
                        dataIndex: "occurredAt",
                        width: 200,
                        render: (value: string) =>
                            value ? new Date(value).toLocaleString() : "—",
                    },
                    {
                        title: t("col_action"),
                        dataIndex: "action",
                        render: (action: string) =>
                            (ACTION_OPTIONS as readonly string[]).includes(action)
                                ? t(`actions.${action as (typeof ACTION_OPTIONS)[number]}`)
                                : action,
                    },
                    {
                        title: t("col_actor"),
                        dataIndex: "actorDisplayName",
                        render: (_: string, row) => (
                            <div>
                                <div>{row.actorEmail || row.actorDisplayName || "—"}</div>
                                {row.actorId ? (
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "rgba(0,0,0,0.45)",
                                            wordBreak: "break-all",
                                        }}
                                    >
                                        {row.actorId}
                                    </div>
                                ) : null}
                            </div>
                        ),
                    },
                    {
                        title: t("col_resource"),
                        key: "resource",
                        render: (_, row) =>
                            [row.resourceType, row.resourceId].filter(Boolean).join(" / ") || "—",
                    },
                    {
                        title: t("col_result"),
                        dataIndex: "result",
                        render: (result: string) => (
                            <Tag color={result === "SUCCESS" ? "green" : "red"}>{result}</Tag>
                        ),
                    },
                    {
                        title: t("col_reason"),
                        dataIndex: "reason",
                        ellipsis: true,
                        render: (reason?: string) => reason || "—",
                    },
                ]}
            />
        </DashboardPage>
    );
}
