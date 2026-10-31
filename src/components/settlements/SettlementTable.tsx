/* Updated to use MUI components instead of Ant Design */
"use client"

import { useState } from "react"
import { Check, ChevronRight, Copy } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback"
import { formatWalletAmountDisplay } from "@/lib/money/asset-display"
import { useSnackbar } from "notistack"
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
} from "@mui/material"
import type { MerchantSettlementReconStatus, SettlementListItem } from "@/lib/settlements/api"
import styles from "./SettlementTable.module.css"

export interface SettlementTableProps {
  items: SettlementListItem[]
  loading: boolean
  isRefreshing?: boolean
  error?: unknown | null
  onRetry?: () => void
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
  onOpenDetail?: (settlementId: string) => void
}

function formatTime(value: string | null, locale: string): string {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

function isNonZeroAmount(value: string | number): boolean {
  const n = typeof value === "number" ? value : Number(String(value).trim())
  return Number.isFinite(n) && n !== 0
}

function reconBadgeClass(status: MerchantSettlementReconStatus): string {
  switch (status) {
    case "EXCEPTION":
      return `${styles.badge} ${styles.badgeException}`
    case "MATCHED":
      return `${styles.badge} ${styles.badgeMatched}`
    default:
      return `${styles.badge} ${styles.badgePending}`
  }
}

function AmountCell({ amount, asset, locale, mutedWhenZero = false }: { amount: string | number; asset: string; locale: string; mutedWhenZero?: boolean }) {
  const raw = typeof amount === "number" ? String(amount) : amount
  const { symbol, amount: body } = formatWalletAmountDisplay(raw, asset, locale)
  const muted = mutedWhenZero && !isNonZeroAmount(raw)
  return (
    <div className={`financial-amount ${styles.amountStack}`}>
      <span className={`${styles.amountPrimary} ${muted ? styles.amountMuted : ""}`}>
        {symbol ? <span className={styles.amountSymbol}>{symbol}</span> : null}
        {body}
      </span>
    </div>
  )
}

export default function SettlementTable({ items, loading, isRefreshing = false, error = null, onRetry, total, page, pageSize, onPageChange, onOpenDetail }: SettlementTableProps) {
  const t = useTranslations("Settlements")
  const locale = useLocale()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const { tableLoading, emptyComponent, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: t("empty"),
    errorDescription: error ? t("loadError") : undefined,
    onRetry,
  })

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedId(value)
      enqueueSnackbar(t("copy_success"), { variant: "success" })
      window.setTimeout(() => setCopiedId((cur) => (cur === value ? null : cur)), 1500)
    } catch {
      enqueueSnackbar(t("copy_failed"), { variant: "error" })
    }
  }

  const renderCopyableId = (value: string, copyAriaLabel: string) => (
    <div className={styles.idRow}>
      <div className={styles.idTextWrap}>
        <Tooltip title={value}>
          <span className={styles.idPrimary}>{value}</span>
        </Tooltip>
      </div>
      <button type="button" className={styles.copyButton} aria-label={copyAriaLabel} onClick={() => void handleCopy(value)}>
        {copiedId === value ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />}
      </button>
    </div>
  )

  const paginationProps = {
    component: "div" as const,
    count: total,
    page: page,
    rowsPerPage: pageSize,
    rowsPerPageOptions: [10, 20, 50, 100] as const,
    onPageChange: (_: unknown, newPage: number) => onPageChange(newPage, pageSize),
    onRowsPerPageChange: (e) => onPageChange(0, parseInt(e.target.value, 10)),
    labelRowsPerPage: t("pagination.rows_per_page" as any),
    labelDisplayedRows: ({ from, to, count }: { from: number; to: number; count: number }) => `${from}–${to} / ${count !== -1 ? count : `more than ${to}`}`,
  }

  return (
    <>
      {refreshBanner}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "8px", border: "1px solid #eef2f6", overflowX: "auto" }}>
        <Table sx={{ minWidth: 1200 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>{t("columns.settlementId")}</TableCell>
              <TableCell>{t("columns.moneyInRef")}</TableCell>
              <TableCell>{t("columns.asset")}</TableCell>
              <TableCell align="right">{t("columns.gross")}</TableCell>
              <TableCell align="right">{t("columns.fee")}</TableCell>
              <TableCell align="right">{t("columns.net")}</TableCell>
              <TableCell>{t("columns.releasedAt")}</TableCell>
              <TableCell>{t("columns.reconStatus")}</TableCell>
              <TableCell>{t("columns.provider")}</TableCell>
              <TableCell align="right">{t("columns.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  {tableLocale?.emptyText ?? t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.settlementId} hover>
                  <TableCell>{renderCopyableId(row.settlementId, t("copy_settlement_id" as any))}</TableCell>
                  <TableCell>{renderCopyableId(row.moneyInRef, t("copy_money_in_ref" as any))}</TableCell>
                  <TableCell>{row.asset}</TableCell>
                  <TableCell align="right"><AmountCell amount={row.gross} asset={row.asset} locale={locale} /></TableCell>
                  <TableCell align="right"><AmountCell amount={row.fee} asset={row.asset} locale={locale} mutedWhenZero /></TableCell>
                  <TableCell align="right"><AmountCell amount={row.net} asset={row.asset} locale={locale} /></TableCell>
                  <TableCell>{formatTime(row.releasedAt, locale)}</TableCell>
                  <TableCell><span className={reconBadgeClass(row.reconStatus)}>{t(`reconStatus.${row.reconStatus}` as any)}</span></TableCell>
                  <TableCell>{row.provider ? row.provider : <span className={styles.mutedDash}>—</span>}</TableCell>
                  <TableCell align="right">
                    {onOpenDetail ? (
                      <button type="button" className={styles.detailLink} aria-label={t("actions.view_detail" as any)} onClick={() => onOpenDetail(row.settlementId)}>
                        {t("actions.view" as any)}
                        <ChevronRight size={13} strokeWidth={2} />
                      </button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination {...paginationProps} />
      </TableContainer>
    </>
  )
}
