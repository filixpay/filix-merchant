"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Space } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, CreditLineView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreditLineListTable from "@/components/credit/CreditLineListTable";
import CreateCreditLineModal from "@/components/credit/CreateCreditLineModal";
import AdjustCreditLimitModal from "@/components/credit/AdjustCreditLimitModal";
import CreditLineHistoryDrawer, {
    type CreditLineHistoryKind,
} from "@/components/credit/CreditLineHistoryDrawer";
import { formatPartyDisplayName } from "@/components/credit/credit-model";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { useTableQueryState } from "@/lib/dashboard/use-table-query-state";

export default function CreditLimitPage() {
    const t = useTranslations("CreditLimit");
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
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
        fetcher: (params, token) => api.credit.listLines(params, token),
    });

    const handleAdjust = (line: CreditLineView) => {
        setSelectedLine(line);
        setIsAdjustModalOpen(true);
    };

    const openHistory = (line: CreditLineView, kind: CreditLineHistoryKind) => {
        setSelectedLine(line);
        setHistoryKind(kind);
    };

    const closeHistory = () => {
        setHistoryKind(null);
        if (!isAdjustModalOpen) {
            setSelectedLine(null);
        }
    };

    const extra = (
        <Space>
            <Button
                icon={<ReloadOutlined />}
                onClick={reload}
                loading={loading}
                title={tCommon("refresh")}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                {t("create")}
            </Button>
        </Space>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} extra={extra}>
            {accessToken ? (
                <CreditLineListTable
                    creditLines={creditLines}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPagination}
                    onRetry={reload}
                    onAdjust={handleAdjust}
                    onViewAdjustments={(line) => openHistory(line, "adjustments")}
                    onViewTransactions={(line) => openHistory(line, "transactions")}
                />
            ) : null}

            {accessToken ? (
                <>
                    <CreateCreditLineModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        accessToken={accessToken}
                        onSuccess={reload}
                    />

                    <AdjustCreditLimitModal
                        isOpen={isAdjustModalOpen}
                        onClose={() => {
                            setIsAdjustModalOpen(false);
                            setSelectedLine(null);
                        }}
                        creditLineId={selectedLine?.id ?? null}
                        debitorName={formatPartyDisplayName(selectedLine?.debitor) || ""}
                        currentLimit={selectedLine?.creditLimit || 0}
                        accessToken={accessToken}
                        onSuccess={reload}
                    />

                    <CreditLineHistoryDrawer
                        open={historyKind != null}
                        onClose={closeHistory}
                        creditLineId={selectedLine?.id ?? null}
                        partyName={formatPartyDisplayName(selectedLine?.debitor)}
                        kind={historyKind}
                        accessToken={accessToken}
                        scope="admin"
                    />
                </>
            ) : null}
        </DashboardPage>
    );
}
