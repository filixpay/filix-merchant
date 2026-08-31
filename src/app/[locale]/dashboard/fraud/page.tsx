"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, Flex, Form, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { api, type FraudEventListItem } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import FraudEventTable from "@/components/fraud/FraudEventTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import {
    DEFAULT_FRAUD_LIST_QUERY,
    FRAUD_SEVERITY_OPTIONS,
    FRAUD_STATUS_OPTIONS,
    type FraudListQuery,
    type FraudSearchFormValues,
} from "@/components/fraud/fraud-list-model";

export default function FraudPage() {
    const t = useTranslations("Fraud");
    const tCommon = useTranslations("Common");
    const tCustomers = useTranslations("Customers");
    const tDisputes = useTranslations("Disputes");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [form] = Form.useForm<FraudSearchFormValues>();
    const [query, setQuery] = useState<FraudListQuery>(DEFAULT_FRAUD_LIST_QUERY);

    const { items: events, total, loading, isRefreshing, error, reload } = usePagedResource<
        FraudEventListItem,
        FraudListQuery
    >({
        accessToken,
        params: query,
        fetcher: async (params, token) => {
            const result = await api.risk.fraud.listPaged(token, params);
            return {
                data: result.items,
                total: result.total,
            };
        },
    });

    const handleSearch = (values: FraudSearchFormValues) => {
        setQuery({
            ...DEFAULT_FRAUD_LIST_QUERY,
            keyword: values.keyword ?? "",
            status: values.status ?? "",
            severity: values.severity ?? "",
            sortBy: query.sortBy,
            sortDir: query.sortDir,
        });
    };

    const handleReset = () => {
        form.resetFields();
        setQuery(DEFAULT_FRAUD_LIST_QUERY);
    };

    const statusOptions = useMemo(
        () =>
            FRAUD_STATUS_OPTIONS.map((status) => ({
                value: status,
                label: t(`status.${status}`),
            })),
        [t],
    );

    const severityOptions = useMemo(
        () =>
            FRAUD_SEVERITY_OPTIONS.map((severity) => ({
                value: severity,
                label: tDisputes(`priority.${severity}`),
            })),
        [tDisputes],
    );

    const filterBar = (
        <Form<FraudSearchFormValues>
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
            <Form.Item name="severity" style={{ minWidth: 160, flex: "0 1 180px", marginInlineEnd: 0 }}>
                <Select allowClear options={severityOptions} placeholder={t("filters.severity")} />
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
            <FraudEventTable
                events={events}
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
