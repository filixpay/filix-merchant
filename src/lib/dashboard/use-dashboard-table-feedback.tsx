"use client";

import { Alert, Button } from "@mui/material";
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

    const emptyComponent = useMemo(() => {
        if (tableState === "error") {
            return (
                <DashboardTableError
                    description={resolvedErrorDescription}
                    onRetry={onRetry}
                />
            );
        }
        return <DashboardTableEmpty description={emptyDescription} />;
    }, [tableState, resolvedErrorDescription, emptyDescription, onRetry]);

    const locale = useMemo(
        () => ({
            emptyText: emptyComponent,
        }),
        [emptyComponent],
    );

    const refreshBanner =
        tableState === "refresh-error" ? (
            <Alert
                severity="warning"
                action={
                    onRetry ? (
                        <Button size="small" onClick={onRetry} color="inherit">
                            {tCommon("refresh")}
                        </Button>
                    ) : null
                }
                sx={{ mb: 1.5 }}
            >
                {tCommon("error")}
            </Alert>
        ) : null;

    return { tableState, tableLoading, locale, emptyComponent, refreshBanner };
}
