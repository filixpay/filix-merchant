"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button, Form, Input, Flex } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { api, RefundView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import RefundListTable from "@/components/refunds/RefundListTable";
import CreateRefundModal from "@/components/refunds/CreateRefundModal";
import RefundDetailsModal from "@/components/refunds/RefundDetailsModal";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { runAuthenticatedRequest } from "@/lib/dashboard/run-authenticated-request";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import toolbarStyles from "@/components/layout/ListToolbar.module.css";

interface RefundFilterValues {
    merchantOrderId?: string;
    merchantRefundId?: string;
}

export default function RefundsPage() {
    return (
        <Suspense fallback={null}>
            <RefundsPageContent />
        </Suspense>
    );
}

function RefundsPageContent() {
    const [form] = Form.useForm<RefundFilterValues>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [page, setPage] = useState(0);
    const pageSize = 20;

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRefund, setSelectedRefund] = useState<RefundView | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const [filters, setFilters] = useState<RefundFilterValues>({});

    const t = useTranslations("Refunds");
    const tCommon = useTranslations("Common");
    const tCustomers = useTranslations("Customers");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const searchParams = useSearchParams();
    const router = useRouter();
    const locale = useLocale();

    const deepLinkRefundId = searchParams.get("merchantRefundId");
    const viewDetail = searchParams.get("view") === "detail";

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, filters),
        [page, pageSize, filters],
    );

    const { items: refunds, total, loading, isRefreshing, error, reload } = usePagedResource<
        RefundView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.refunds.list(params, token),
    });

    const handleSearch = (values: RefundFilterValues) => {
        setFilters({
            merchantOrderId: values.merchantOrderId?.trim() || undefined,
            merchantRefundId: values.merchantRefundId?.trim() || undefined,
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

    const handleViewDetails = async (merchantRefundId: string) => {
        setShowDetailModal(true);
        setDetailLoading(true);
        try {
            const detail = await runAuthenticatedRequest(accessToken, (token) =>
                api.refunds.get(merchantRefundId, token),
            );
            setSelectedRefund(detail ?? null);
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        if (!viewDetail || !deepLinkRefundId || !accessToken) {
            return;
        }
        void handleViewDetails(deepLinkRefundId);
        // Open once from query; handleViewDetails is stable enough for this page.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewDetail, deepLinkRefundId, accessToken]);

    const closeDetail = () => {
        setShowDetailModal(false);
        setSelectedRefund(null);
        if (viewDetail || deepLinkRefundId) {
            router.replace(`/${locale}/dashboard/refunds`);
        }
    };

    const filterBar = (
        <Form<RefundFilterValues>
            form={form}
            layout="inline"
            onFinish={handleSearch}
            className={toolbarStyles.filterShell}
        >
            <div className={toolbarStyles.filterRow}>
                <Form.Item name="merchantOrderId" className={toolbarStyles.filterField}>
                    <Input allowClear prefix={<SearchOutlined />} placeholder={t("headers.order_id")} />
                </Form.Item>
                <Form.Item name="merchantRefundId" className={toolbarStyles.filterField}>
                    <Input allowClear prefix={<SearchOutlined />} placeholder={t("headers.refund_id")} />
                </Form.Item>
                <Form.Item className={toolbarStyles.filterActions}>
                    <Flex gap={8}>
                        <Button type="default" htmlType="submit" icon={<SearchOutlined />} loading={loading}>
                            {tCustomers("search")}
                        </Button>
                        <Button onClick={handleReset} disabled={loading}>
                            {tCommon("reset")}
                        </Button>
                    </Flex>
                </Form.Item>
            </div>
        </Form>
    );

    const extra = (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
            {t("create_refund")}
        </Button>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} filterBar={filterBar} extra={extra}>
            <RefundListTable
                refunds={refunds}
                loading={loading}
                isRefreshing={isRefreshing}
                error={error}
                onRetry={reload}
                total={total}
                page={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onViewDetails={handleViewDetails}
            />

            {accessToken ? (
                <CreateRefundModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={reload}
                    accessToken={accessToken}
                />
            ) : null}

            <RefundDetailsModal
                isOpen={showDetailModal}
                onClose={closeDetail}
                refund={selectedRefund}
                loading={detailLoading}
            />
        </DashboardPage>
    );
}
