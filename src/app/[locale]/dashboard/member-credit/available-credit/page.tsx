"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { api, CreditLineView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreditLineListTable from "@/components/credit/CreditLineListTable";
import CreditLineHistoryDrawer, {
    type CreditLineHistoryKind,
} from "@/components/credit/CreditLineHistoryDrawer";
import { formatPartyDisplayName } from "@/components/credit/credit-model";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { useTableQueryState } from "@/lib/dashboard/use-table-query-state";

export default function AvailableCreditPage() {
    const t = useTranslations("MemberCreditLimit");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [selectedLine, setSelectedLine] = useState<CreditLineView | null>(null);
    const [historyKind, setHistoryKind] = useState<CreditLineHistoryKind | null>(null);
    const { page, pageSize, setPagination } = useTableQueryState();

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize),
        [page, pageSize],
    );

    const { items: creditLines, total, loading, isRefreshing, error, reload } = usePagedResource<
        CreditLineView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.memberCredit.listLines(params, token),
    });

    const openHistory = (line: CreditLineView, kind: CreditLineHistoryKind) => {
        setSelectedLine(line);
        setHistoryKind(kind);
    };

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")}>
            {accessToken ? (
                <>
                    <CreditLineListTable
                        creditLines={creditLines}
                        loading={loading}
                        isRefreshing={isRefreshing}
                        error={error}
                        emptyText={t("empty")}
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={setPagination}
                        onRetry={reload}
                        onViewAdjustments={(line) => openHistory(line, "adjustments")}
                        onViewTransactions={(line) => openHistory(line, "transactions")}
                        variant="member"
                        translationNs="MemberCreditLimit"
                    />

                    <CreditLineHistoryDrawer
                        open={historyKind != null}
                        onClose={() => {
                            setHistoryKind(null);
                            setSelectedLine(null);
                        }}
                        creditLineId={selectedLine?.id ?? null}
                        partyName={formatPartyDisplayName(selectedLine?.creditor)}
                        kind={historyKind}
                        accessToken={accessToken}
                        scope="member"
                    />
                </>
            ) : null}
        </DashboardPage>
    );
}
