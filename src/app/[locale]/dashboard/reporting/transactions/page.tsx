"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Button, DatePicker, Flex, Form, Input, InputNumber, notification, Select, Space } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import DashboardPage from "@/components/layout/DashboardPage";
import TransactionListTable from "@/components/reporting/TransactionListTable";
import filterStyles from "@/components/reporting/TransactionFilterBar.module.css";
import { downloadReportBlob } from "@/components/reporting/download-report-blob";
import {
    buildTransactionFilters,
    buildTransactionListQuery,
    DEFAULT_TRANSACTION_LIST_QUERY,
    normalizeTransactionPage,
    TRANSACTION_STATUS_OPTIONS,
    type TransactionListQuery,
    type TransactionSearchFormValues,
} from "@/components/reporting/transaction-list-model";
import { ApiError } from "@/lib/api";
import {
    reportingApi,
    type ReportPageDto,
    type TransactionReportRow,
} from "@/lib/api/domains/reporting";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

export default function ReportingTransactionsPage() {
    const t = useTranslations("Reporting.transactions");
    const tCommon = useTranslations("Common");
    const tCustomers = useTranslations("Customers");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [form] = Form.useForm<TransactionSearchFormValues>();
    const [query, setQuery] = useState<TransactionListQuery>(DEFAULT_TRANSACTION_LIST_QUERY);
    const [exporting, setExporting] = useState(false);

    const reportFilters = useMemo(() => buildTransactionFilters(query), [query]);

    const listRequest = useMemo(
        () => ({
            apiVersion: "V1" as const,
            domain: "TRANSACTION" as const,
            view: "LIST" as const,
            filters: reportFilters,
            page: query.page,
            size: query.size,
            sort: "createdAt DESC",
        }),
        [reportFilters, query.page, query.size],
    );

    const { items, total, loading, isRefreshing, error, reload } = usePagedResource<
        TransactionReportRow,
        typeof listRequest
    >({
        accessToken,
        params: listRequest,
        fetcher: async (params, token) => {
            const page = await reportingApi.query<ReportPageDto<TransactionReportRow>>(token, params);
            const normalized = normalizeTransactionPage(page);
            return {
                data: normalized.items,
                total: normalized.total,
            };
        },
    });

    const statusOptions = useMemo(
        () =>
            TRANSACTION_STATUS_OPTIONS.map((status) => ({
                value: status,
                label: status,
            })),
        [],
    );

    const handleSearch = (values: TransactionSearchFormValues) => {
        setQuery(buildTransactionListQuery(values, { page: 0, size: query.size }));
    };

    const handleReset = () => {
        form.resetFields();
        setQuery(DEFAULT_TRANSACTION_LIST_QUERY);
    };

    const handleExport = async () => {
        if (!accessToken) {
            return;
        }

        setExporting(true);
        try {
            const blob = await reportingApi.export(accessToken, {
                apiVersion: "V1",
                domain: "TRANSACTION",
                filters: reportFilters,
            });
            const stamp = new Date().toISOString().slice(0, 10);
            downloadReportBlob(blob, `transactions-${stamp}.csv`);
        } catch (err) {
            if (err instanceof ApiError) {
                notification.error({
                    message: t("export_failed"),
                    description: `${String(err.code ?? err.status)}: ${err.message}`,
                });
            } else {
                notification.error({
                    message: t("export_failed"),
                    description: tCommon("error"),
                });
            }
        } finally {
            setExporting(false);
        }
    };

    const filterBar = (
        <Form<TransactionSearchFormValues>
            form={form}
            layout="inline"
            onFinish={handleSearch}
            className={filterStyles.filterBar}
        >
            <Form.Item name="merchantOrderId" className={`${filterStyles.filterField} ${filterStyles.filterSearch}`}>
                <Input allowClear prefix={<SearchOutlined />} placeholder={t("filters.merchant_order_id")} />
            </Form.Item>
            <Form.Item name="status" className={`${filterStyles.filterField} ${filterStyles.filterSelect}`}>
                <Select allowClear options={statusOptions} placeholder={t("filters.status")} />
            </Form.Item>
            <Form.Item name="channel" className={`${filterStyles.filterField} ${filterStyles.filterChannel}`}>
                <Input allowClear placeholder={t("filters.channel")} />
            </Form.Item>
            <Form.Item className={`${filterStyles.filterField} ${filterStyles.filterAmount}`}>
                <Space.Compact style={{ width: "100%" }}>
                    <Form.Item name="amountMin" noStyle>
                        <InputNumber style={{ width: "50%" }} min={0} placeholder={t("filters.amount_min")} />
                    </Form.Item>
                    <Form.Item name="amountMax" noStyle>
                        <InputNumber style={{ width: "50%" }} min={0} placeholder={t("filters.amount_max")} />
                    </Form.Item>
                </Space.Compact>
            </Form.Item>
            <Form.Item name="createdTimeRange" className={`${filterStyles.filterField} ${filterStyles.filterDate}`}>
                <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    showTime
                    placeholder={[t("filters.created_from"), t("filters.created_to")]}
                />
            </Form.Item>
            <Form.Item className={filterStyles.filterActions}>
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

    const exportButton = (
        <Button
            icon={<DownloadOutlined />}
            loading={exporting}
            disabled={!accessToken}
            onClick={handleExport}
        >
            {t("export")}
        </Button>
    );

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            extra={exportButton}
            filterBar={filterBar}
            contentMode="table"
        >
            <TransactionListTable
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
