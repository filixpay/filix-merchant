"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { api, CreditLineAdjustmentView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreditLineAdjustmentTable from "@/components/credit/CreditLineAdjustmentTable";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { useTableQueryState } from "@/lib/dashboard/use-table-query-state";

export default function CreditAdjustmentRecordsPage() {
    const t = useTranslations("CreditAdjustment");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const { page, pageSize, setPagination } = useTableQueryState();

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize),
        [page, pageSize],
    );

    const { items: adjustments, total, loading, isRefreshing, error, reload } = usePagedResource<
        CreditLineAdjustmentView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.credit.listAdjustments(params, token),
    });

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")}>
            {accessToken ? (
                <CreditLineAdjustmentTable
                    adjustments={adjustments}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPagination}
                    onRetry={reload}
                />
            ) : null}
        </DashboardPage>
    );
}
