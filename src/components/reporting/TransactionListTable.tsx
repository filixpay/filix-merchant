// Updated to MUI components
"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import MoneyMovementIdCell from "@/components/money/MoneyMovementIdCell";
import AmountCell from "@/components/layout/AmountCell";
import DateTimeCell from "@/components/layout/DateTimeCell";
import StatusBadge, { type StatusBadgeTone } from "@/components/layout/StatusBadge";
import type { TransactionReportRow } from "@/lib/api/domains/reporting/types";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
  reportingTransactionFallbackPath,
  resolveReportingBusinessDetailPath,
} from "@/lib/reporting/reporting-business-detail-path";
import {
  formatTransactionAmount,
  formatTransactionDateTime,
  type TransactionListQuery,
} from "./transaction-list-model";
import styles from "./TransactionListTable.module.css";
import listStyles from "@/components/money/MoneyListTable.module.css";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

interface TransactionListTableProps {
  items: TransactionReportRow[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  query: TransactionListQuery;
  onQueryChange: (next: TransactionListQuery) => void;
}

const mapStatusToTone = (status: string): StatusBadgeTone => {
  const s = (status || "").toUpperCase();
  if (s === "SUCCEEDED" || s === "SUCCESS" || s === "COMPLETED") return "success";
  if (s === "FAILED" || s === "REJECTED" || s === "CANCELLED") return "danger";
  if (s === "PENDING" || s === "PROCESSING") return "warning";
  return "neutral";
};

export default function TransactionListTable({
  items,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  total,
  query,
  onQueryChange,
}: TransactionListTableProps) {
  const t = useTranslations("Reporting.transactions");
  const locale = useLocale();
  const router = useRouter();

  const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: t("empty"),
    onRetry,
  });

  const statusLabel = (status: string) => {
    const key = status?.trim().toUpperCase() ?? "";
    if (!key) return "—";
    const messageKey = `statuses.${key}` as Parameters<typeof t>[0];
    return t.has(messageKey) ? t(messageKey) : status;
  };

  const orderTypeLabel = (orderType: string | null | undefined) => {
    const key = orderType?.trim().toUpperCase() ?? "";
    if (!key) return "—";
    const messageKey = `orderTypes.${key}` as Parameters<typeof t>[0];
    return t.has(messageKey) ? t(messageKey) : orderType;
  };

  const detailHref = (row: TransactionReportRow) =>
    resolveReportingBusinessDetailPath(locale, row.orderType, row.businessId) ??
    reportingTransactionFallbackPath(locale, row.reportId);

  const openDetail = (row: TransactionReportRow) => {
    router.push(detailHref(row));
  };

  const columns: Array<{
    title: string;
    dataIndex?: keyof TransactionReportRow;
    key: string;
    width?: number;
    align?: "right" | "center" | "left";
    render?: (value: any, row: TransactionReportRow) => React.ReactNode;
  }> = [
    {
      title: t("columns.merchant_order_id"),
      dataIndex: "merchantOrderId",
      key: "merchantOrderId",
      width: 240,
      render: (value: string, row) => <MoneyMovementIdCell value={value} href={detailHref(row)} />, // eslint-disable-line react/jsx-key
    },
    {
      title: t("columns.trade_no"),
      dataIndex: "tradeNo",
      key: "tradeNo",
      width: 240,
      render: (value: string, row) => <MoneyMovementIdCell value={value} href={detailHref(row)} />, // eslint-disable-line react/jsx-key
    },
    {
      title: t("columns.order_type"),
      dataIndex: "orderType",
      key: "orderType",
      width: 120,
      render: (orderType: string | null) => orderTypeLabel(orderType),
    },
    {
      title: t("columns.status"),
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => <StatusBadge label={statusLabel(status)} tone={mapStatusToTone(status)} />, // eslint-disable-line react/jsx-key
    },
    {
      title: t("columns.amount"),
      key: "amount",
      width: 140,
      align: "right",
      render: (_, row) => <AmountCell amount={row.amount} currency={row.currency} alignRight />, // eslint-disable-line react/jsx-key
    },
    {
      title: t("columns.channel"),
      dataIndex: "channel",
      key: "channel",
      width: 120,
      render: (value: string) => (value ? <span className={styles.channel}>{value}</span> : "—"),
    },
    {
      title: t("columns.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      align: "right",
      render: (value: string) => <DateTimeCell value={value} />, // eslint-disable-line react/jsx-key
    },
  ];

  // Pagination props for MUI TablePagination (zero‑based page index)
  const paginationProps = {
    component: "div" as const,
    count: total,
    page: query.page,
    rowsPerPage: query.size,
    rowsPerPageOptions: [10, 20, 50, 100] as const,
    onPageChange: (_: unknown, newPage: number) => onQueryChange({ ...query, page: newPage, size: query.size }),
    onRowsPerPageChange: (e: ChangeEvent<HTMLInputElement>) =>
      onQueryChange({ ...query, page: 0, size: parseInt(e.target.value, 10) }),
    labelRowsPerPage: t("pagination.rows_per_page" as any),
    labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
      `${from}–${to} / ${count !== -1 ? count : `more than ${to}`}`,
  };

  return (
    <>
      {refreshBanner}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "8px", border: "1px solid #eef2f6", overflowX: "auto" }}>
        <MuiTable className={listStyles.table} sx={{ minWidth: 1200 }} size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align} style={{ width: col.width }}>
                  {col.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  {tableLocale?.emptyText ?? t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.reportId} hover onClick={() => openDetail(row)} sx={{ cursor: "pointer" }}>
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align}>
                      {col.render
                        ? col.render((row as any)[col.dataIndex as keyof TransactionReportRow], row)
                        : (row as any)[col.dataIndex as keyof TransactionReportRow]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
        <TablePagination {...paginationProps} />
      </TableContainer>
    </>
  );
}
