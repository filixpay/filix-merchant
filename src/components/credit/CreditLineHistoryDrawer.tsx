"use client";

import { useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import { useTranslations } from "next-intl";
import { api, type CreditLineAdjustmentView, type CreditTransactionView } from "@/lib/api";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { filterByCreditLineId } from "./credit-model";
import CreditLineAdjustmentTable from "./CreditLineAdjustmentTable";
import CreditTransactionTable from "./CreditTransactionTable";

export type CreditLineHistoryKind = "adjustments" | "transactions";
type CreditLineHistoryScope = "admin" | "member";

interface CreditLineHistoryDrawerProps {
    open: boolean;
    onClose: () => void;
    creditLineId: number | null;
    partyName?: string;
    kind: CreditLineHistoryKind | null;
    accessToken: string;
    scope?: CreditLineHistoryScope;
}

const HISTORY_FETCH_SIZE = 100;

export default function CreditLineHistoryDrawer({
    open,
    onClose,
    creditLineId,
    partyName,
    kind,
    accessToken,
    scope = "admin",
}: CreditLineHistoryDrawerProps) {
    const tAdjustment = useTranslations(
        scope === "member" ? "MemberCreditAdjustment" : "CreditAdjustment",
    );
    const tTransaction = useTranslations(
        scope === "member" ? "MemberCreditTransaction" : "CreditTransaction",
    );
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        if (open) {
            setPage(0);
            setPageSize(20);
        }
    }, [open, creditLineId, kind]);

    const requestParams = useMemo(
        () => buildPagedListParams(0, HISTORY_FETCH_SIZE),
        [],
    );

    const adjustmentFetcher =
        scope === "member" ? api.memberCredit.listAdjustments : api.credit.listAdjustments;
    const transactionFetcher =
        scope === "member" ? api.memberCredit.listTransactions : api.credit.listTransactions;

    const adjustmentsResource = usePagedResource<
        CreditLineAdjustmentView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: adjustmentFetcher,
        enabled: open && kind === "adjustments" && creditLineId != null,
    });

    const transactionsResource = usePagedResource<
        CreditTransactionView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: transactionFetcher,
        enabled: open && kind === "transactions" && creditLineId != null,
    });

    const filteredAdjustments = useMemo(
        () => filterByCreditLineId(adjustmentsResource.items, creditLineId),
        [adjustmentsResource.items, creditLineId],
    );
    const filteredTransactions = useMemo(
        () => filterByCreditLineId(transactionsResource.items, creditLineId),
        [transactionsResource.items, creditLineId],
    );

    const pagedAdjustments = useMemo(() => {
        const start = page * pageSize;
        return filteredAdjustments.slice(start, start + pageSize);
    }, [filteredAdjustments, page, pageSize]);

    const pagedTransactions = useMemo(() => {
        const start = page * pageSize;
        return filteredTransactions.slice(start, start + pageSize);
    }, [filteredTransactions, page, pageSize]);

    const handlePageChange = (nextPage: number, nextPageSize: number) => {
        setPage(nextPage);
        setPageSize(nextPageSize);
    };

    const handleClose = () => {
        setPage(0);
        setPageSize(20);
        onClose();
    };

    const titleBase = kind === "transactions" ? tTransaction("title") : tAdjustment("title");
    const title = partyName ? `${titleBase} · ${partyName}` : titleBase;

    return (
        <Drawer title={title} open={open && kind != null} onClose={handleClose} width={960} destroyOnHidden>
            {kind === "adjustments" ? (
                <CreditLineAdjustmentTable
                    adjustments={pagedAdjustments}
                    loading={adjustmentsResource.loading}
                    isRefreshing={adjustmentsResource.isRefreshing}
                    error={adjustmentsResource.error}
                    total={filteredAdjustments.length}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onRetry={adjustmentsResource.reload}
                    variant={scope === "member" ? "member" : "admin"}
                    translationNs={scope === "member" ? "MemberCreditAdjustment" : "CreditAdjustment"}
                />
            ) : null}
            {kind === "transactions" ? (
                <CreditTransactionTable
                    transactions={pagedTransactions}
                    loading={transactionsResource.loading}
                    isRefreshing={transactionsResource.isRefreshing}
                    error={transactionsResource.error}
                    total={filteredTransactions.length}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onRetry={transactionsResource.reload}
                    variant={scope === "member" ? "member" : "admin"}
                    translationNs={
                        scope === "member" ? "MemberCreditTransaction" : "CreditTransaction"
                    }
                />
            ) : null}
        </Drawer>
    );
}
