"use client";

import { Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useTranslations } from "next-intl";
import { ApiError, type MoneyInView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import MoneyAmountCell from "@/components/money/MoneyAmountCell";
import MoneyMovementIdCell from "@/components/money/MoneyMovementIdCell";
import listStyles from "@/components/money/MoneyListTable.module.css";
import { moneyStatusToneToTagColor } from "@/lib/money/activity-display";
import { presentMoneyI18nLabel } from "@/lib/money/money-i18n-label";
import { presentMoneyMovementAmount } from "@/lib/money/money-movement-amount";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { presentMoneyStatus } from "@/lib/money/status-presenter";

export interface MoneyInListTableProps {
  items: MoneyInView[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick?: (moneyInId: string) => void;
  /** Detail href for ID link (same destination as row click). */
  detailHref?: (moneyInId: string) => string;
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const data = error.data as { reasonCode?: string } | undefined;
    return presentMoneyProductError({
      reasonCode: data?.reasonCode,
      code: error.code,
      message: error.message,
    });
  }
  return presentMoneyProductError({});
}

function formatTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export default function MoneyInListTable({
  items,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  total,
  page,
  pageSize,
  onPageChange,
  onRowClick,
  detailHref,
}: MoneyInListTableProps) {
  const t = useTranslations("MoneyIn");
  const tCommon = useTranslations("MoneyCommon");

  const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: t("empty"),
    errorDescription: error ? resolveErrorMessage(error) : undefined,
    onRetry,
  });

  const columns: ColumnsType<MoneyInView> = [
    {
      title: t("columns.id"),
      dataIndex: "moneyInId",
      key: "moneyInId",
      width: 240,
      render: (value: string) => (
        <MoneyMovementIdCell value={value} href={detailHref?.(value)} />
      ),
    },
    {
      title: t("columns.time"),
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 180,
      render: (value: string | null) => formatTime(value),
    },
    {
      title: t("columns.amount"),
      key: "amount",
      align: "right",
      render: (_: unknown, row) => {
        if (row.amount == null || !row.assetCode) return "—";
        return (
          <MoneyAmountCell
            presentation={presentMoneyMovementAmount({
              amount: row.amount,
              assetCode: row.assetCode,
              semantic: "inflow",
            })}
          />
        );
      },
    },
    {
      title: t("columns.status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const presented = presentMoneyStatus(status);
        return (
          <Tag color={moneyStatusToneToTagColor(presented.tone)}>
            {presentMoneyI18nLabel(tCommon, tCommon.has, "statuses", presented.code)}
          </Tag>
        );
      },
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page + 1,
    pageSize,
    total,
    showSizeChanger: false,
    onChange: (nextPage, nextSize) => onPageChange(nextPage - 1, nextSize),
  };

  return (
    <>
      {refreshBanner}
      <Table
        className={onRowClick ? listStyles.table : undefined}
        rowKey="moneyInId"
        columns={columns}
        dataSource={items}
        loading={tableLoading}
        locale={tableLocale}
        pagination={total > 0 ? pagination : false}
        scroll={{ x: 800 }}
        onRow={(row) => ({
          onClick: () => onRowClick?.(row.moneyInId),
          className: onRowClick ? "clickable-row" : undefined,
        })}
      />
    </>
  );
}
