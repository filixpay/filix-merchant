// Updated to MUI components
"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import { getStatusTagColor, formatAmount } from "./payment-split-model";
import PaymentSplitDetailsModal from "./PaymentSplitDetailsModal";
import TradeNoText from "../TradeNoText";
import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
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
import type { PaymentSplitView, PaymentSplitDetailView, api, ApiError } from "@/lib/api";
import { signIn } from "next-auth/react";

interface PaymentSplitTableProps {
  records: PaymentSplitView[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  accessToken: string;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function PaymentSplitTable({
  records,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  accessToken,
  total,
  page,
  pageSize,
  onPageChange,
}: PaymentSplitTableProps) {
  const t = useTranslations("PaymentSplits");
  const tCommon = useTranslations("Common");

  const [detailRecord, setDetailRecord] = useState<PaymentSplitDetailView | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleViewDetails = async (id: number) => {
    setIsModalOpen(true);
    setDetailLoading(true);
    try {
      const data = await api.paymentSplits.get(id, accessToken);
      setDetailRecord(data);
    } catch (err) {
      console.error("Failed to fetch details:", err);
      if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
        signIn();
      }
      enqueueSnackbar(tCommon("error") as string, { variant: "error" });
    } finally {
      setDetailLoading(false);
    }
  };

  const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: records.length,
    emptyDescription: tCommon("no_data"),
    onRetry,
  });

  // Pagination handling – MUI TablePagination expects zero‑based page index
  const paginationProps = {
    component: "div" as const,
    count: total,
    page: page,
    rowsPerPage: pageSize,
    rowsPerPageOptions: [10, 20, 50, 100] as const,
    onPageChange: (_: unknown, newPage: number) => onPageChange(newPage, pageSize),
    onRowsPerPageChange: (e) => onPageChange(0, parseInt(e.target.value, 10)),
    labelRowsPerPage: tCommon("pagination.rows_per_page" as any),
    labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) =>
      `${from}–${to} / ${count !== -1 ? count : `more than ${to}`}`,
  };

  return (
    <>
      {refreshBanner}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "8px", border: "1px solid #eef2f6", overflowX: "auto" }}>
        <Table sx={{ minWidth: 1000 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t("headers.trade_no")}</TableCell>
              <TableCell>{t("headers.split_amount")}</TableCell>
              <TableCell>{t("headers.type")}</TableCell>
              <TableCell>{t("headers.status")}</TableCell>
              <TableCell>{t("headers.receivers")}</TableCell>
              <TableCell>{t("headers.created_at")}</TableCell>
              <TableCell align="center">{tCommon("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading && records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  {locale?.emptyText ?? tCommon("no_data")}
                </TableCell>
              </TableRow>
            ) : (
              records.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <TradeNoText value={r.tradeNo} ellipsis />
                  </TableCell>
                  <TableCell>
                    <Stack direction="vertical" spacing={0}>
                      <Typography variant="body2" color="success.main">{formatAmount(r.splitAmount)}</Typography>
                      <Typography variant="caption" color="text.secondary">Total: {formatAmount(r.orderAmount)}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{t(`types.${r.paymentSplitType}`) || r.paymentSplitType}</TableCell>
                  <TableCell>
                    <Chip label={t(`statuses.${r.paymentSplitStatus}`) || r.paymentSplitStatus} color={getStatusTagColor(r.paymentSplitStatus) as any} size="small" />
                  </TableCell>
                  <TableCell>
                    <Stack direction="vertical" spacing={0}>
                      <Typography variant="body2">{r.successCount} / {r.receiverCount}</Typography>
                      {r.failureCount > 0 && (
                        <Typography variant="caption" color="error.main">Fail: {r.failureCount}</Typography>
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={tCommon("view") as string}>
                      <IconButton size="small" onClick={() => handleViewDetails(r.id)}>
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </TableContainer>
      <PaymentSplitDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDetailRecord(null);
        }}
        record={detailRecord}
        loading={detailLoading}
      />
    </>
  );
}
