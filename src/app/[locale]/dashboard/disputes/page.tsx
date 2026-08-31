"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, Flex, Form, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { api, type DisputeListItem, type DisputeOperationalSummary } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import DisputeOperationalKpis from "@/components/disputes/DisputeOperationalKpis";
import DisputeListTable from "@/components/disputes/DisputeListTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
    DEFAULT_DISPUTE_LIST_QUERY,
    DISPUTE_STATUS_OPTIONS,
    type DisputeListQuery,
    type DisputeSearchFormValues,
} from "@/components/disputes/dispute-list-model";

const EMPTY_SUMMARY: DisputeOperationalSummary = {
    actionRequired: 0,
    dueSoon: 0,
    overdue: 0,
};

export default function DisputesPage() {
    const t = useTranslations("Disputes");
    const tCommon = useTranslations("Common");
    const tCustomers = useTranslations("Customers");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [form] = Form.useForm<DisputeSearchFormValues>();
    const [query, setQuery] = useState<DisputeListQuery>(DEFAULT_DISPUTE_LIST_QUERY);
    const [summary, setSummary] = useState<DisputeOperationalSummary>(EMPTY_SUMMARY);

    const { items: disputes, total, loading, isRefreshing, error, reload } = usePagedResource<
        DisputeListItem,
        DisputeListQuery
    >({
        accessToken,
        params: query,
        fetcher: async (params, token) => {
            const result = await api.risk.disputes.list(token, params);
            setSummary(result.summary);
            return {
                data: result.items,
                total: result.total,
            };
        },
    });

    const handleSearch = (values: DisputeSearchFormValues) => {
        setQuery({
            ...DEFAULT_DISPUTE_LIST_QUERY,
            keyword: values.keyword ?? "",
            status: values.status ?? "",
            channelCode: values.channelCode ?? "",
            sortBy: query.sortBy,
            sortDir: query.sortDir,
        });
    };

    const handleReset = () => {
        form.resetFields();
        setQuery(DEFAULT_DISPUTE_LIST_QUERY);
    };

    const statusOptions = useMemo(
        () =>
            DISPUTE_STATUS_OPTIONS.map((status) => ({
                value: status,
                label: t(`status.${status}`),
            })),
        [t],
    );

    const filterBar = (
        <Form<DisputeSearchFormValues>
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
            <Form.Item name="keyword" style={{ minWidth: 220, flex: "1 1 240px", marginInlineEnd: 0 }}>
                <Input allowClear prefix={<SearchOutlined />} placeholder={t("filters.keyword")} />
            </Form.Item>
            <Form.Item name="status" style={{ minWidth: 160, flex: "0 1 180px", marginInlineEnd: 0 }}>
                <Select allowClear options={statusOptions} placeholder={t("filters.status")} />
            </Form.Item>
            <Form.Item name="channelCode" style={{ minWidth: 160, flex: "0 1 180px", marginInlineEnd: 0 }}>
                <Input allowClear placeholder={t("filters.channel")} />
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
        <DashboardPage title={t("title")} subtitle={t("subtitle")} filterBar={filterBar}>
            <DisputeOperationalKpis summary={summary} loading={loading} />
            <DisputeListTable
                disputes={disputes}
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
