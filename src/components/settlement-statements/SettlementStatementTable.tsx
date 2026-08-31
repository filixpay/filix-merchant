"use client";

import { Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Table } from "antd";
import { AlertCircle, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import MoneyAssetLabel from "@/components/money/MoneyAssetLabel";
import type {
  CoverageState,
  PeriodState,
  SettlementStatementSummary,
} from "@/lib/settlement-statements/api";
import styles from "./SettlementStatementTable.module.css";

export interface SettlementStatementTableProps {
  items: SettlementStatementSummary[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onOpenDetail?: (statementKey: string) => void;
}

function isNonZeroAmount(value: string | number): boolean {
  const n = typeof value === "number" ? value : Number(String(value).trim());
  return Number.isFinite(n) && n !== 0;
}

function AmountCell({
  value,
  assetCode,
  locale,
  primary = false,
}: {
  value: string | number;
  assetCode: string;
  locale: string;
  primary?: boolean;
}) {
  const raw = typeof value === "number" ? String(value) : value;
  const { symbol, amount } = formatWalletAmountDisplay(raw, assetCode, locale);
  const nonZero = isNonZeroAmount(raw);
  const className = [
    styles.amountCell,
    primary ? styles.amountPrimary : "",
    primary && nonZero ? styles.amountEmphasis : "",
    !nonZero ? styles.amountMuted : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={`financial-amount ${className}`}>
      {symbol ? <span className={styles.amountSymbol}>{symbol}</span> : null}
      {amount}
    </span>
  );
}

function PeriodStateBadge({ state }: { state: PeriodState }) {
  const t = useTranslations("SettlementStatements");
  if (state === "OPEN") {
    return (
      <Tooltip title={t("openHint")}>
        <span className={styles.periodOpen}>
          <Clock size={12} strokeWidth={2} />
          {t("periodState.OPEN")}
        </span>
      </Tooltip>
    );
  }
  return <span className={styles.periodClosed}>{t("periodState.CLOSED")}</span>;
}

function CoverageBadge({ state }: { state: CoverageState }) {
  const t = useTranslations("SettlementStatements");
  if (state === "OK") {
    return (
      <span className={styles.coverageOk}>
        <CheckCircle2 size={13} strokeWidth={2} />
        {t("coverageState.OK")}
      </span>
    );
  }
  if (state === "PARTIAL_COVERAGE") {
    return (
      <span className={styles.coverageWarn}>
        <AlertCircle size={13} strokeWidth={2} />
        {t("coverageState.PARTIAL_COVERAGE")}
      </span>
    );
  }
  return (
    <span className={styles.coverageError}>
      <AlertCircle size={13} strokeWidth={2} />
      {t("coverageState.INCONSISTENT")}
    </span>
  );
}

export default function SettlementStatementTable({
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
}: SettlementStatementTableProps) {
  const t = useTranslations("SettlementStatements");
  const locale = useLocale();

  const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: t("empty"),
    errorDescription: error ? t("loadError") : undefined,
    onRetry,
  });

  const columns: ColumnsType<SettlementStatementSummary> = [
    {
      title: t("columns.periodKey"),
      dataIndex: "periodKey",
      key: "periodKey",
      width: 160,
      render: (value: string) => <span className={styles.periodCell}>{value}</span>,
    },
    {
      title: t("columns.asset"),
      dataIndex: "assetCode",
      key: "assetCode",
      width: 120,
      render: (value: string) => <MoneyAssetLabel assetCode={value} compact />,
    },
    {
      title: t("columns.periodState"),
      key: "periodState",
      width: 120,
      render: (_: unknown, row) => <PeriodStateBadge state={row.periodState} />,
    },
    {
      title: t("columns.settlementNet"),
      key: "settlementNet",
      align: "right",
      width: 160,
      render: (_: unknown, row) => (
        <AmountCell
          value={row.settlementNet}
          assetCode={row.assetCode}
          locale={locale}
          primary
        />
      ),
    },
    {
      title: t("columns.released"),
      key: "releasedAmount",
      align: "right",
      width: 140,
      render: (_: unknown, row) => (
        <AmountCell value={row.releasedAmount} assetCode={row.assetCode} locale={locale} />
      ),
    },
    {
      title: t("columns.payout"),
      key: "payoutAmount",
      align: "right",
      width: 140,
      render: (_: unknown, row) => (
        <AmountCell value={row.payoutAmount} assetCode={row.assetCode} locale={locale} />
      ),
    },
    {
      title: t("columns.coverage"),
      key: "coverageState",
      align: "center",
      width: 130,
      render: (_: unknown, row) => <CoverageBadge state={row.coverageState} />,
    },
    {
      title: t("columns.actions"),
      key: "actions",
      align: "right",
      width: 100,
      fixed: "right",
      render: (_: unknown, row) => (
        <button
          type="button"
          className={styles.detailLink}
          onClick={() => onOpenDetail?.(row.statementKey)}
          aria-label={t("actions.view_detail")}
        >
          {t("actions.view_detail")}
          <ChevronRight size={13} strokeWidth={2} />
        </button>
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page + 1,
    pageSize,
    total,
    showSizeChanger: true,
    showTotal: (count) => t("pagination.total", { count }),
    onChange: (nextPage, nextSize) => onPageChange(nextPage - 1, nextSize),
  };

  return (
    <>
      {refreshBanner}
      <div className={styles.tableWrap}>
        <Table<SettlementStatementSummary>
          rowKey="statementKey"
          size="middle"
          columns={columns}
          dataSource={items}
          loading={tableLoading}
          locale={tableLocale}
          pagination={pagination}
          scroll={{ x: 1080 }}
        />
      </div>
    </>
  );
}
