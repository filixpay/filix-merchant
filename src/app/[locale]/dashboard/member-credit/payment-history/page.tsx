"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { api, CreditTransactionView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreditTransactionTable from "@/components/credit/CreditTransactionTable";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { useTableQueryState } from "@/lib/dashboard/use-table-query-state";

export default function PaymentHistoryPage() {
    const t = useTranslations("MemberCreditTransaction");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const { page, pageSize, setPagination } = useTableQueryState();

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize),
        [page, pageSize],
    );

    const { items: transactions, total, loading, isRefreshing, error, reload } = usePagedResource<
        CreditTransactionView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.memberCredit.listTransactions(params, token),
    });

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")}>
            {accessToken ? (
                <CreditTransactionTable
                    transactions={transactions}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    emptyText={t("empty")}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPagination}
                    onRetry={reload}
                    variant="member"
                    translationNs="MemberCreditTransaction"
                />
            ) : null}
        </DashboardPage>
    );
}
