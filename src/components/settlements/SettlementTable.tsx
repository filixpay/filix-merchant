"use client";

import { useState } from "react";
import { message, Table, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Check, ChevronRight, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import type {
  MerchantSettlementReconStatus,
  SettlementListItem,
} from "@/lib/settlements/api";
import styles from "./SettlementTable.module.css";

export interface SettlementTableProps {
  items: SettlementListItem[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onOpenDetail?: (settlementId: string) => void;
}

function formatTime(value: string | null, locale: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function isNonZeroAmount(value: string | number): boolean {
  const n = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(n) && n !== 0;
}

function reconBadgeClass(status: MerchantSettlementReconStatus): string {
  switch (status) {
    case "EXCEPTION":
      return `${styles.badge} ${styles.badgeException}`;
    case "MATCHED":
      return `${styles.badge} ${styles.badgeMatched}`;
    default:
      return `${styles.badge} ${styles.badgePending}`;
  }
}

function AmountCell({
  amount,
  asset,
  locale,
  mutedWhenZero = false,
}: {
  amount: string | number;
  asset: string;
  locale: string;
  mutedWhenZero?: boolean;
}) {
  const raw = typeof amount === "number" ? String(amount) : amount;
  const { symbol, amount: body } = formatWalletAmountDisplay(raw, asset, locale);
  const muted = mutedWhenZero && !isNonZeroAmount(raw);
  return (
    <div className={`financial-amount ${styles.amountStack}`}>
      <span className={`${styles.amountPrimary} ${muted ? styles.amountMuted : ""}`}>
        {symbol ? <span className={styles.amountSymbol}>{symbol}</span> : null}
        {body}
      </span>
    </div>
  );
}

export default function SettlementTable({
  items,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  total,
  page,
  pageSize,
  onPageChange,
  onOpenDetail,
}: SettlementTableProps) {
  const t = useTranslations("Settlements");
  const locale = useLocale();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: t("empty"),
    errorDescription: error ? t("loadError") : undefined,
    onRetry,
  });

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(value);
      message.success(t("copy_success"));
      window.setTimeout(() => setCopiedId((cur) => (cur === value ? null : cur)), 1500);
    } catch {
      message.error(t("copy_failed"));
    }
  };

  const renderCopyableId = (
    value: string,
    copyAriaLabel: string,
  ) => (
    <div className={styles.idRow}>
      <div className={styles.idTextWrap}>
        <Tooltip title={value}>
          <span className={styles.idPrimary}>{value}</span>
        </Tooltip>
      </div>
      <button
        type="button"
        className={styles.copyButton}
        aria-label={copyAriaLabel}
        onClick={() => void handleCopy(value)}
      >
        {copiedId === value ? (
          <Check size={12} strokeWidth={2} />
        ) : (
          <Copy size={12} strokeWidth={2} />
        )}
      </button>
    </div>
  );

  const columns: ColumnsType<SettlementListItem> = [
    {
      title: t("columns.settlementId"),
      key: "settlementId",
      width: 200,
      render: (_: unknown, row) =>
        renderCopyableId(row.settlementId, t("copy_settlement_id")),
    },
    {
      title: t("columns.moneyInRef"),
      key: "moneyInRef",
      width: 180,
      render: (_: unknown, row) =>
        renderCopyableId(row.moneyInRef, t("copy_money_in_ref")),
    },
    {
      title: t("columns.asset"),
      dataIndex: "asset",
      key: "asset",
      width: 80,
    },
    {
      title: t("columns.gross"),
      key: "gross",
      align: "right",
      width: 120,
      render: (_: unknown, row) => (
        <AmountCell amount={row.gross} asset={row.asset} locale={locale} />
      ),
    },
    {
      title: t("columns.fee"),
      key: "fee",
      align: "right",
      width: 100,
      render: (_: unknown, row) => (
        <AmountCell amount={row.fee} asset={row.asset} locale={locale} mutedWhenZero />
      ),
    },
    {
      title: t("columns.net"),
      key: "net",
      align: "right",
      width: 120,
      render: (_: unknown, row) => (
        <AmountCell amount={row.net} asset={row.asset} locale={locale} />
      ),
    },
    {
      title: t("columns.releasedAt"),
      key: "releasedAt",
      width: 150,
      render: (_: unknown, row) => formatTime(row.releasedAt, locale),
    },
    {
      title: t("columns.reconStatus"),
      key: "reconStatus",
      width: 120,
      render: (_: unknown, row) => (
        <span className={reconBadgeClass(row.reconStatus)}>{t(`reconStatus.${row.reconStatus}`)}</span>
      ),
    },
    {
      title: t("columns.provider"),
      dataIndex: "provider",
      key: "provider",
      width: 100,
      render: (value: string | null) =>
        value ? value : <span className={styles.mutedDash}>—</span>,
    },
    {
      title: t("columns.actions"),
      key: "actions",
      width: 96,
      fixed: "right",
      render: (_: unknown, row) =>
        onOpenDetail ? (
          <button
            type="button"
            className={styles.detailLink}
            aria-label={t("actions.view_detail")}
            onClick={() => onOpenDetail(row.settlementId)}
          >
            {t("actions.view")}
            <ChevronRight size={13} strokeWidth={2} />
          </button>
        ) : null,
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page + 1,
    pageSize,
    total,
    showSizeChanger: true,
    onChange: (nextPage, nextSize) => onPageChange(nextPage - 1, nextSize ?? pageSize),
  };

  return (
    <>
      {refreshBanner}
      <Table
        className={styles.table}
        rowKey="settlementId"
        columns={columns}
        dataSource={items}
        loading={tableLoading}
        pagination={pagination}
        scroll={{ x: 1200 }}
        locale={tableLocale}
      />
    </>
  );
}
