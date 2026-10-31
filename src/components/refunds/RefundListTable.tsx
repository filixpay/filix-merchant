"use client";

import React from "react";
import {
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RefundView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import AmountCell from "@/components/layout/AmountCell";
import DateTimeCell from "@/components/layout/DateTimeCell";
import StatusBadge, { type StatusBadgeTone } from "@/components/layout/StatusBadge";
import { refundStatusI18nKey } from "./refund-model";

interface RefundListTableProps {
    refunds: RefundView[];
    loading: boolean;
    isRefreshing?: boolean;
    error?: unknown | null;
    onRetry?: () => void;
    emptyText?: string;
    total?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    onViewDetails?: (merchantRefundId: string) => void;
}

export default function RefundListTable({
    refunds,
    loading,
    isRefreshing = false,
    error = null,
    onRetry,
    emptyText,
    total,
    page = 0,
    pageSize = 20,
    onPageChange,
    onViewDetails,
}: RefundListTableProps) {
    const t = useTranslations("Refunds");
    const tCommon = useTranslations("Common");

    const { tableLoading, emptyComponent, refreshBanner } = useDashboardTableFeedback({
        loading,
        isRefreshing,
        error,
        rowCount: refunds.length,
        emptyDescription: emptyText || t("empty"),
        onRetry,
    });

    return (
        <Box sx={{ width: "100%", position: "relative" }}>
            {refreshBanner}
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                    borderRadius: "8px",
                    border: "1px solid #eef2f6",
                    overflowX: "auto",
                }}
            >
                <Table sx={{ minWidth: 900 }} size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("headers.refund_id")}</TableCell>
                            <TableCell>{t("headers.order_id")}</TableCell>
                            <TableCell align="right" sx={{ width: 140 }}>{t("headers.amount")}</TableCell>
                            <TableCell sx={{ width: 130 }}>{t("headers.status")}</TableCell>
                            <TableCell sx={{ width: 160 }}>{t("headers.created_at")}</TableCell>
                            <TableCell align="right" sx={{ width: 80 }}>{tCommon("actions")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableLoading && refunds.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : refunds.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                    {emptyComponent}
                                </TableCell>
                            </TableRow>
                        ) : (
                            refunds.map((refund) => {
                                const key = refundStatusI18nKey(refund.status);
                                const label = key ? t(`status.${key}` as any) : refund.status;
                                let tone: StatusBadgeTone = "neutral";
                                switch (refund.status) {
                                    case "COMPLETED": tone = "success"; break;
                                    case "PENDING": tone = "processing"; break;
                                    case "FAILED":
                                    case "REJECTED": tone = "danger"; break;
                                    case "CANCELED": tone = "neutral"; break;
                                }

                                return (
                                    <TableRow key={refund.refundId || refund.merchantRefundId} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                                                {refund.refundId}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: 12 }}>
                                                {refund.merchantRefundId}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.primary">
                                                {refund.paymentId || "-"}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <AmountCell
                                                amount={refund.amount ?? 0}
                                                currency={""}
                                                alignRight
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge label={label} tone={tone} />
                                        </TableCell>
                                        <TableCell>
                                            <DateTimeCell value={refund.createdAt} />
                                        </TableCell>
                                        <TableCell align="right">
                                            {onViewDetails ? (
                                                <Tooltip title={t("details.view")}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onViewDetails(refund.merchantRefundId)}
                                                        sx={{ color: "text.secondary" }}
                                                    >
                                                        <Eye size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
                {onPageChange && total != null && total > 0 && (
                    <TablePagination
                        component="div"
                        count={total}
                        page={page}
                        rowsPerPage={pageSize}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        onPageChange={(_, newPage) => onPageChange(newPage, pageSize)}
                        onRowsPerPageChange={(e) => onPageChange(0, parseInt(e.target.value, 10))}
                        labelRowsPerPage={tCommon("pagination.rows_per_page")}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}–${to} / ${count !== -1 ? count : `more than ${to}`}`
                        }
                    />
                )}
            </TableContainer>
        </Box>
    );
}
