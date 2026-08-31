"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Form, Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, PaymentSplitView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import PaymentSplitTable from "@/components/payment-splits/PaymentSplitTable";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

type PaymentSplitFilters = {
    tradeNo?: string;
};

export default function PaymentSplitsPage() {
    const t = useTranslations("PaymentSplits");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [form] = Form.useForm();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [filters, setFilters] = useState<PaymentSplitFilters>({});

    const requestParams = useMemo(
        () => ({
            page,
            size: pageSize,
            ...filters,
        }),
        [page, pageSize, filters],
    );

    const { items: records, total, loading, isRefreshing, error, reload } = usePagedResource<
        PaymentSplitView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.paymentSplits.list(params, token),
    });

    const onSearch = (values: PaymentSplitFilters) => {
        setPage(0);
        setFilters(values);
    };

    const onReset = () => {
        form.resetFields();
        setPage(0);
        setFilters({});
    };

    const filterBar = (
        <Form form={form} layout="inline" onFinish={onSearch}>
            <Form.Item name="tradeNo">
                <Input
                    placeholder={t("headers.trade_no")}
                    prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                    allowClear
                    style={{ width: 300 }}
                />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        {tCommon("submit")}
                    </Button>
                    <Button onClick={onReset} icon={<ReloadOutlined />}>
                        {tCommon("reset")}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            filterBar={filterBar}
        >
            {accessToken ? (
                <PaymentSplitTable
                    records={records}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    onRetry={reload}
                    accessToken={accessToken}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={(p, ps) => {
                        setPage(p - 1);
                        setPageSize(ps);
                    }}
                />
            ) : null}
        </DashboardPage>
    );
}
