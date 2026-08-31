"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Tabs, Badge, Space, Pagination } from "antd";
import { useTranslations } from "next-intl";
import { api, TransferView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import TransferAuditTable from "@/components/transfer-audit/TransferAuditTable";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import styles from "./page.module.css";

type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

type TransferFilters = {
    approvalStatus: ApprovalStatus;
};

export default function TransfersPage() {
    const t = useTranslations("Transfers");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [page, setPage] = useState(0);
    const pageSize = 20;
    const [filters, setFilters] = useState<TransferFilters>({ approvalStatus: "PENDING" });
    const [statusCounts, setStatusCounts] = useState<Record<ApprovalStatus, number>>({
        PENDING: 0,
        APPROVED: 0,
        REJECTED: 0,
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
        fetcher: (params, token) => api.transfers.list(params, token),
    });

    const handleStatusChange = (status: ApprovalStatus) => {
        setFilters({ approvalStatus: status });
        setPage(0);
    };

    useEffect(() => {
        if (!accessToken) {
            return;
        }
        let cancelled = false;

        const fetchCounts = async () => {
            try {
                const statuses: ApprovalStatus[] = ["PENDING", "APPROVED", "REJECTED"];
                const responses = await Promise.all(
                    statuses.map((approvalStatus) =>
                        api.transfers.list({ page: 0, size: 1, approvalStatus }, accessToken),
                    ),
                );
                if (!cancelled) {
                    setStatusCounts({
                        PENDING: responses[0].total,
                        APPROVED: responses[1].total,
                        REJECTED: responses[2].total,
                    });
                }
            } catch {
                if (!cancelled) {
                    setStatusCounts({ PENDING: 0, APPROVED: 0, REJECTED: 0 });
                }
            }
        };

        void fetchCounts();
        return () => {
            cancelled = true;
        };
    }, [accessToken, isRefreshing]);

    const filterBar = (
        <Tabs
            className={styles.auditTabs}
            activeKey={filters.approvalStatus}
            onChange={(key) => handleStatusChange(key as ApprovalStatus)}
            items={[
                {
                    key: "PENDING",
                    label: (
                        <span className={styles.tabLabel}>
                            {t("tabs.waiting")}
                            <Badge
                                count={statusCounts.PENDING}
                                size="small"
                                className={styles.badgePending}
                            />
                        </span>
                    ),
                },
                {
                    key: "APPROVED",
                    label: (
                        <span className={styles.tabLabel}>
                            {t("tabs.passed")}
                            <Badge
                                count={statusCounts.APPROVED}
                                size="small"
                                className={styles.badgeNeutral}
                            />
                        </span>
                    ),
                },
                {
                    key: "REJECTED",
                    label: (
                        <span className={styles.tabLabel}>
                            {t("tabs.rejected")}
                            <Badge
                                count={statusCounts.REJECTED}
                                size="small"
                                className={styles.badgeNeutral}
                            />
                        </span>
                    ),
                },
            ]}
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
                        currentStatus={filters.approvalStatus}
                        onSuccess={reload}
                        accessToken={accessToken}
                        mode="AUDIT"
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
