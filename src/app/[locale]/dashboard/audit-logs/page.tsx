"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, DatePicker, Flex, Form, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { api, type AuditLogItem, type AuditLogListQuery } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import AuditLogTable from "@/components/audit-logs/AuditLogTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
    AUDIT_RESULT_OPTIONS,
    buildAuditLogListQuery,
    DEFAULT_AUDIT_LOG_LIST_QUERY,
    P0_AUDIT_ACTIONS,
    type AuditLogSearchFormValues,
} from "@/components/audit-logs/audit-log-list-model";

export default function AuditLogsPage() {
    const t = useTranslations("AuditLogs");
    const tAction = useTranslations("audit.action");
    const tCommon = useTranslations("Common");
    const tCustomers = useTranslations("Customers");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [form] = Form.useForm<AuditLogSearchFormValues>();
    const [query, setQuery] = useState<AuditLogListQuery>(DEFAULT_AUDIT_LOG_LIST_QUERY);

    const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
        AuditLogItem,
        AuditLogListQuery
    >({
        accessToken,
        params: query,
        fetcher: async (params, token) => {
            const result = await api.audit.list(token, params);
            return {
                data: result.items,
                total: result.totalElements,
            };
        },
    });

    const handleSearch = (values: AuditLogSearchFormValues) => {
        setQuery(buildAuditLogListQuery(values, { page: 0, size: query.size ?? 20 }));
    };

    const handleReset = () => {
        form.resetFields();
        setQuery(DEFAULT_AUDIT_LOG_LIST_QUERY);
    };

    const actionOptions = useMemo(
        () =>
            P0_AUDIT_ACTIONS.map((action) => ({
                value: action,
                label: tAction.has(action) ? tAction(action) : action,
            })),
        [tAction],
    );

    const resultOptions = useMemo(
        () =>
            AUDIT_RESULT_OPTIONS.map((result) => ({
                value: result,
                label: t(`result.${result}`),
            })),
        [t],
    );

    const filterBar = (
        <Form<AuditLogSearchFormValues>
            form={form}
            layout="inline"
            onFinish={handleSearch}
            style={{
                display: "flex",
                gap: 8,
                rowGap: 8,
                width: "100%",
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            <Form.Item name="dateRange" style={{ minWidth: 280, flex: "1 1 320px", marginInlineEnd: 0 }}>
                <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    showTime
                    placeholder={[t("filter.date_range_start"), t("filter.date_range_end")]}
                />
            </Form.Item>
            <Form.Item name="action" style={{ minWidth: 200, flex: "0 1 240px", marginInlineEnd: 0 }}>
                <Select allowClear options={actionOptions} placeholder={t("filter.action")} />
            </Form.Item>
            <Form.Item name="result" style={{ minWidth: 140, flex: "0 1 160px", marginInlineEnd: 0 }}>
                <Select allowClear options={resultOptions} placeholder={t("filter.result")} />
            </Form.Item>
            <Form.Item style={{ marginInlineEnd: 0, marginLeft: "auto" }}>
                <Flex gap={8}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                        {tCustomers("search")}
                    </Button>
                    <Button onClick={handleReset} disabled={loading}>
                        {tCommon("reset")}
                    </Button>
                </Flex>
            </Form.Item>
        </Form>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} filterBar={filterBar} contentMode="table">
            <AuditLogTable
                items={items}
                loading={loading}
                isRefreshing={isRefreshing}
                error={error}
                onRetry={reload}
                total={total}
                query={query}
                onQueryChange={setQuery}
            />
        </DashboardPage>
    );
}
