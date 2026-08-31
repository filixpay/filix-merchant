"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Segmented, Space, Pagination } from "antd";
import { useTranslations } from "next-intl";
import { api, TransferView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import TransferAuditTable from "@/components/transfer-audit/TransferAuditTable";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

type ReviewStatus = "INITIAL" | "SUCCESS" | "FAILED";

type ReviewFilters = {
    reviewStatus: ReviewStatus;
};

export default function ReviewsPage() {
    const t = useTranslations("Reviews");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [page, setPage] = useState(0);
    const pageSize = 20;
    const [filters, setFilters] = useState<ReviewFilters>({
        reviewStatus: "INITIAL",
    });

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, filters),
        [page, pageSize, filters],
    );

    const { items: transfers, total, loading, isRefreshing, error, reload } = usePagedResource<
        TransferView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: async (params, token) => {
            if (params.reviewStatus === "INITIAL") {
                const [approved, rejected] = await Promise.all([
                    api.transfers.list({ ...params, approvalStatus: "APPROVED" }, token),
                    api.transfers.list({ ...params, approvalStatus: "REJECTED" }, token),
                ]);
                const approvedRows = approved.data ?? approved.content ?? [];
                const rejectedRows = rejected.data ?? rejected.content ?? [];
                return {
                    ...approved,
                    data: [...approvedRows, ...rejectedRows],
                    content: [...approvedRows, ...rejectedRows],
                    total: (approved.total ?? 0) + (rejected.total ?? 0),
                };
            }
            return api.transfers.list(params, token);
        },
    });

    const handleStatusChange = (status: ReviewStatus) => {
        setFilters((current) => ({ ...current, reviewStatus: status }));
        setPage(0);
    };

    const filterBar = (
        <Segmented
            options={[
                { label: t("tabs.pending"), value: "INITIAL" },
                { label: t("tabs.active"), value: "SUCCESS" },
                { label: t("tabs.rejected"), value: "FAILED" },
            ]}
            value={filters.reviewStatus}
            onChange={handleStatusChange}
        />
    );

    return (
        <DashboardPage
            title={t("title")}
            subtitle={t("subtitle")}
            filterBar={filterBar}
        >
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {accessToken ? (
                    <TransferAuditTable
                        transfers={transfers}
                        loading={loading}
                        isRefreshing={isRefreshing}
                        error={error}
                        onRetry={reload}
                        currentStatus={filters.reviewStatus}
                        onSuccess={reload}
                        accessToken={accessToken}
                        mode="REVIEW"
                    />
                ) : null}

                {total > 0 && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Pagination
                            current={page + 1}
                            total={total}
                            pageSize={pageSize}
                            onChange={(p) => setPage(p - 1)}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </Space>
        </DashboardPage>
    );
}
