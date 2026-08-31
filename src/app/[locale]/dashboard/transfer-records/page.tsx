"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Form, Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import TransferTable from "@/components/transfer-records/TransferTable";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

type TransferRecordFilters = {
    merchantOrderId?: string;
};

export default function TransferRecordsPage() {
    const t = useTranslations("TransferRecords");
    const tCommon = useTranslations("Common");
    const tCustomers = useTranslations("Customers");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [form] = Form.useForm<TransferRecordFilters>();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [filters, setFilters] = useState<TransferRecordFilters>({});

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, filters),
        [page, pageSize, filters],
    );

    const { items: records, total, loading, isRefreshing, error, reload } = usePagedResource({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.wallet.listTransfers(params, token),
    });

    const onSearch = (values: TransferRecordFilters) => {
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
            <Form.Item name="merchantOrderId">
                <Input
                    placeholder={t("headers.transfer_no")}
                    prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                    allowClear
                    style={{ width: 250 }}
                />
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        {tCustomers("search")}
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
                <TransferTable
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
