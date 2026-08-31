"use client";

import { useState, type ReactNode } from "react";
import { message, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Check, ChevronRight, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import type {
  MerchantTransactionReconStatus,
  TransactionReconItem,
} from "@/lib/transaction-reconciliation/api";
import styles from "./TransactionReconTable.module.css";

export interface TransactionReconTableProps {
  items: TransactionReconItem[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onOpenDetail?: (reconciliationItemId: string) => void;
  emptyDescription?: ReactNode;
}

function statusBadgeClass(status: MerchantTransactionReconStatus): string {
  switch (status) {
    case "MATCHED":
      return `${styles.badge} ${styles.badgeMatched}`;
    case "MISMATCH":
      return `${styles.badge} ${styles.badgeMismatch}`;
    case "NOT_RECONCILED":
      return `${styles.badge} ${styles.badgeNotReconciled}`;
    default:
      return `${styles.badge} ${styles.badgePending}`;
  }
}

function IdCell({
  value,
  copiedId,
  onCopy,
  ariaLabel,
}: {
  value: string;
  copiedId: string | null;
  onCopy: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <div className={styles.idRow}>
      <span className={styles.idPrimary} title={value}>
        {value}
      </span>
      <button
        type="button"
        className={styles.copyButton}
        aria-label={ariaLabel}
        onClick={() => onCopy(value)}
      >
        {copiedId === value ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />}
      </button>
    </div>
  );
}

export default function TransactionReconTable({
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
  emptyDescription,
}: TransactionReconTableProps) {
  const t = useTranslations("TransactionReconciliation");
  const locale = useLocale();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: emptyDescription ?? t("empty"),
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

  const formatBizDate = (value: string) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const columns: ColumnsType<TransactionReconItem> = [
    {
      title: t("columns.payment"),
      key: "paymentId",
      ellipsis: true,
      render: (_: unknown, row) => (
        <IdCell
          value={row.paymentId}
          copiedId={copiedId}
          onCopy={(v) => void handleCopy(v)}
          ariaLabel={t("copy_payment_id")}
        />
      ),
    },
    {
      title: t("columns.order"),
      key: "orderId",
      ellipsis: true,
      render: (_: unknown, row) => (
        <IdCell
          value={row.orderId}
          copiedId={copiedId}
          onCopy={(v) => void handleCopy(v)}
          ariaLabel={t("copy_order_id")}
        />
      ),
    },
    {
      title: t("columns.reconciliationLevel"),
      key: "reconciliationLevel",
      width: 120,
      render: (_: unknown, row) => (
        <span className={styles.levelTag}>{t("reconciliationLevelOrder")}</span>
      ),
    },
    {
      title: t("columns.channelCode"),
      dataIndex: "channelCode",
      key: "channelCode",
      width: 100,
    },
    {
      title: t("columns.reconciliationStatus"),
      key: "reconciliationStatus",
      width: 140,
      render: (_: unknown, row) => (
        <span className={statusBadgeClass(row.reconciliationStatus)}>
          {t(`reconStatus.${row.reconciliationStatus}`)}
        </span>
      ),
    },
    {
      title: t("columns.bizDate"),
      key: "bizDate",
      width: 120,
      render: (_: unknown, row) => formatBizDate(row.bizDate),
    },
    {
      title: t("columns.actions"),
      key: "actions",
      width: 72,
      align: "center",
      render: (_: unknown, row) =>
        onOpenDetail ? (
          <button
            type="button"
            className={styles.detailButton}
            aria-label={t("actions.view_detail")}
            onClick={() => onOpenDetail(row.reconciliationItemId)}
          >
            <ChevronRight size={16} strokeWidth={2} />
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
        rowKey="reconciliationItemId"
        columns={columns}
        dataSource={items}
        loading={tableLoading}
        pagination={pagination}
        locale={tableLocale}
        tableLayout="auto"
      />
    </>
  );
}
