"use client";

import { Alert, Button } from "antd";
import type { TableProps } from "antd/es/table";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import DashboardTableEmpty from "@/components/layout/DashboardTableEmpty";
import DashboardTableError from "@/components/layout/DashboardTableError";
import { resolveDashboardTableState } from "./table-state";

export type DashboardTableFeedbackOptions = {
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    rowCount: number;
    emptyDescription: React.ReactNode;
    errorDescription?: React.ReactNode;
    onRetry?: () => void;
};

export function useDashboardTableFeedback({
    loading,
    isRefreshing = false,
    error = null,
    rowCount,
    emptyDescription,
    errorDescription,
    onRetry,
}: DashboardTableFeedbackOptions) {
    const tCommon = useTranslations("Common");

    const tableState = resolveDashboardTableState({
        loading,
        error,
        rowCount,
    });

    const tableLoading = loading || isRefreshing;
    const resolvedErrorDescription = errorDescription ?? tCommon("error");

    const locale: TableProps["locale"] = useMemo(
        () => ({
            emptyText:
                tableState === "error" ? (
                    <DashboardTableError
                        description={resolvedErrorDescription}
                        onRetry={onRetry}
                    />
                ) : (
                    <DashboardTableEmpty description={emptyDescription} />
                ),
        }),
        [tableState, resolvedErrorDescription, emptyDescription, onRetry],
    );

    const refreshBanner =
        tableState === "refresh-error" ? (
            <Alert
                type="warning"
                showIcon
                message={tCommon("error")}
                action={
                    onRetry ? (
                        <Button size="small" onClick={onRetry}>
                            {tCommon("refresh")}
                        </Button>
                    ) : null
                }
            />
        ) : null;

    return { tableState, tableLoading, locale, refreshBanner };
}
