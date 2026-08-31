"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Flex, Form, Input } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, ClientView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CustomerTable from "@/components/customers/CustomerTable";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

interface CustomerFilterValues {
    code?: string;
    email?: string;
    phone?: string;
}

export default function CustomersPage() {
    const [form] = Form.useForm<CustomerFilterValues>();
    const [page, setPage] = useState(0);
    const pageSize = 20;
    const [filters, setFilters] = useState<CustomerFilterValues>({});

    const t = useTranslations("Customers");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, filters, { page: "pageNumber", size: "pageSize" }),
        [page, pageSize, filters],
    );

    const { items: customers, total, loading, isRefreshing, error, reload } = usePagedResource<
        ClientView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.clients.list(params, token),
    });

    const handleSearch = (values: CustomerFilterValues) => {
        setFilters({
            code: values.code?.trim() || undefined,
            email: values.email?.trim() || undefined,
            phone: values.phone?.trim() || undefined,
        });
        setPage(0);
    };

    const handleReset = () => {
        form.resetFields();
        setFilters({});
        setPage(0);
    };

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
    };

    const filterBar = (
        <Form<CustomerFilterValues>
            form={form}
            layout="inline"
            onFinish={handleSearch}
            style={{ display: "flex", gap: 8, flexWrap: "wrap", width: "100%" }}
        >
            <Form.Item name="code" style={{ minWidth: 200, flex: "1 1 220px", marginInlineEnd: 0 }}>
                <Input allowClear prefix={<SearchOutlined />} placeholder={t("headers.code")} />
            </Form.Item>
            <Form.Item name="email" style={{ minWidth: 200, flex: "1 1 220px", marginInlineEnd: 0 }}>
                <Input allowClear prefix={<SearchOutlined />} placeholder={t("headers.email")} />
            </Form.Item>
            <Form.Item name="phone" style={{ minWidth: 200, flex: "1 1 220px", marginInlineEnd: 0 }}>
                <Input allowClear prefix={<SearchOutlined />} placeholder={t("headers.phone")} />
            </Form.Item>
            <Form.Item style={{ marginInlineEnd: 0, marginLeft: "auto" }}>
                <Flex gap={8}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                        {t("search")}
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                        {tCommon("reset")}
                    </Button>
                </Flex>
            </Form.Item>
        </Form>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} filterBar={filterBar}>
            {accessToken ? (
                <CustomerTable
                    customers={customers}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    onRetry={reload}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            ) : null}
        </DashboardPage>
    );
}
