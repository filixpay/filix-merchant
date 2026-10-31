"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import TradeNoText from "@/components/TradeNoText";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import type { MerchantLedgerMovementRow } from "@/lib/money/ledger-movement-display";
import { presentLedgerMovementLabel } from "@/lib/money/ledger-movement-labels";
import styles from "./LedgerMovementModal.module.css";

interface LedgerMovementTableProps {
  movements: MerchantLedgerMovementRow[];
  loading: boolean;
  emptyText?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  hideFooterPagination?: boolean;
}

export default function LedgerMovementTable({
  movements,
  loading,
  emptyText,
  page = 0,
  pageSize = 20,
  total = 0,
  onPageChange,
  hideFooterPagination = false,
}: LedgerMovementTableProps) {
  const t = useTranslations("MoneyBalance.movements");
  const locale = useLocale();

  // Convert rows to include a unique `id` for MUI DataGrid
  const rows = movements.map((r, i) => ({
    ...r,
    id:
      r.movementId ||
      `${r.occurredAt}-${r.referenceId}-${r.direction}-${r.amount}` ||
      i,
  }));

  const columns: GridColDef<MerchantLedgerMovementRow>[] = [
    {
      field: "occurredAt",
      headerName: t("headers.time"),
      width: 168,
      renderCell: (params: GridRenderCellParams<MerchantLedgerMovementRow>) => {
        const record = params.row;
        return (
          <span className={styles.timeCell}>
            {new Date(record.occurredAt).toLocaleString(locale, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </span>
        );
      },
    },
    {
      field: "businessType",
      headerName: t("headers.type"),
      width: 128,
      renderCell: (params: GridRenderCellParams<MerchantLedgerMovementRow>) => {
        const { value, row: record } = params;
        const isCredit = record.signedAmountPrefix === "+";
        return (
          <span className={`${styles.typeBadge} ${isCredit ? styles.typeBadgeCredit : styles.typeBadgeDebit}`}>
            {isCredit ? (
              <ArrowDownLeft size={12} strokeWidth={2} aria-hidden />
            ) : (
              <ArrowUpRight size={12} strokeWidth={2} aria-hidden />
            )}
            {presentLedgerMovementLabel(t, t.has, "businessTypes", (value ?? "") as string)}
          </span>
        );
      },
    },
    {
      field: "journalNumber",
      headerName: t("headers.journal"),
      width: 100,
      renderCell: (params: GridRenderCellParams<MerchantLedgerMovementRow>) => (
        <span className={styles.journalCell}>{(params.value as string) || "—"}</span>
      ),
    },
    {
      field: "reference",
      headerName: t("headers.reference"),
      width: 260,
      renderCell: (params: GridRenderCellParams<MerchantLedgerMovementRow>) => {
        const record = params.row;
        if (!record.referenceId && !record.externalReference) {
          return <Typography variant="body2" color="text.secondary">—</Typography>;
        }
        return (
          <div className={styles.referenceStack}>
            {record.referenceId ? (
              <div className={styles.referencePrimary}>
                <TradeNoText value={record.referenceId} ellipsis />
              </div>
            ) : null}
            {record.externalReference && (
              <span className={styles.referenceSub} title={record.externalReference}>
                {t("related_reference", { id: record.externalReference })}
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: "amount",
      headerName: t("headers.amount"),
      width: 120,
      align: "right",
      renderCell: (params: GridRenderCellParams<MerchantLedgerMovementRow>) => {
        const record = params.row;
        const amountParts = formatWalletAmountDisplay(String(record.amount), record.assetCode, locale);
        const isCredit = record.signedAmountPrefix === "+";
        return (
          <span className={`${styles.amountValue} financial-amount ${isCredit ? styles.amountCredit : styles.amountDebit}`}>
            {record.signedAmountPrefix}{amountParts.amount}
          </span>
        );
      },
    },
  ];

  return (
    <DataGrid
      className={styles.table}
      rows={rows}
      columns={columns}
      loading={loading}
      paginationModel={{ page, pageSize }}
      paginationMode="server"
      rowCount={total}
      onPaginationModelChange={(model) => onPageChange?.(model.page)}
      hideFooterPagination={hideFooterPagination}
      autoHeight
      slotProps={{
        noRowsOverlay: {
          children: <>{emptyText || t("empty")}</>,
        },
      }}
    />
  );
}
