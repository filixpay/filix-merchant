"use client";

import { Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import MoneyAmountCell from "@/components/money/MoneyAmountCell";
import MoneyMovementIdCell from "@/components/money/MoneyMovementIdCell";
import listStyles from "@/components/money/MoneyListTable.module.css";
import { ApiError, type MoneyActivityItem } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
  moneyStatusToneToTagColor,
  presentMoneyActivityItem,
} from "@/lib/money/activity-display";
import { resolveActivityDetailPath } from "@/lib/money/activity-detail-path";
import { presentMoneyI18nLabel } from "@/lib/money/money-i18n-label";
import {
  presentMoneyMovementAmount,
  resolveActivityAmountSemantic,
} from "@/lib/money/money-movement-amount";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import DateTimeCell from "@/components/layout/DateTimeCell";
import StatusBadge, { type StatusBadgeTone } from "@/components/layout/StatusBadge";

export interface MoneyActivityTableProps {
  items: MoneyActivityItem[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
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
}export default function MoneyActivityTable({
  items,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  total,
  page,
  pageSize,
  onPageChange,
}: MoneyActivityTableProps) {
  const t = useTranslations("MoneyActivity");
  const tCommon = useTranslations("MoneyCommon");
  const locale = useLocale();
  const router = useRouter();

  const { tableLoading, locale: tableLocale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: items.length,
    emptyDescription: t("empty"),
    errorDescription: error ? resolveErrorMessage(error) : undefined,
    onRetry,
  });

  const rows = items.map((item) => {
    const display = presentMoneyActivityItem(item);
    const detailHref = resolveActivityDetailPath(locale, display.sourceType, display.sourceId);
    return {
      key: `${item.sourceType}-${item.sourceId}-${item.occurredAt}`,
      ...display,
      detailHref,
    };
  });

  const columns: ColumnsType<(typeof rows)[number]> = [
    {
      title: t("columns.reference"),
      dataIndex: "sourceId",
      key: "sourceId",
      width: 240,
      render: (value: string, row) => (
        <MoneyMovementIdCell value={value} href={row.detailHref} />
      ),
    },
    {
      title: t("columns.time"),
      dataIndex: "occurredAt",
      key: "occurredAt",
      width: 180,
      render: (value: string) => <DateTimeCell value={value} />,
    },
    {
      title: t("columns.amount"),
      key: "amount",
      align: "right",
      render: (_: unknown, row) => {
        const semantic = resolveActivityAmountSemantic({
          movementType: row.movementType,
          sourceType: row.sourceType,
        });
        return (
          <MoneyAmountCell
            presentation={presentMoneyMovementAmount({
              amount: row.amount,
              assetCode: row.assetCode,
              semantic,
            })}
          />
        );
      },
    },
    {
      title: t("columns.source"),
      dataIndex: "sourceType",
      key: "sourceType",
      render: (value: string) => presentMoneyI18nLabel(tCommon, tCommon.has, "sources", value),
    },
    {
      title: t("columns.movement"),
      dataIndex: "movementType",
      key: "movementType",
      render: (value: string | null) =>
        value ? presentMoneyI18nLabel(tCommon, tCommon.has, "movementTypes", value) : "—",
    },
    {
      title: t("columns.status"),
      dataIndex: "statusCode",
      key: "status",
      width: 120,
      render: (_: string, row) => {
        let tone: StatusBadgeTone = "neutral";
        if (row.statusTone === "success") tone = "success";
        if (row.statusTone === "warning") tone = "warning";
        if (row.statusTone === "danger") tone = "danger";
        return (
          <StatusBadge 
            label={presentMoneyI18nLabel(tCommon, tCommon.has, "statuses", row.statusCode)} 
            tone={tone} 
          />
        );
      },
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page + 1,
    pageSize,
    total,
    showSizeChanger: true,
    showTotal: (count) => tCommon("total", { count }),
    onChange: (nextPage, nextSize) => onPageChange(nextPage - 1, nextSize),
  };

  return (
    <>
      {refreshBanner}
      <Table
        className={listStyles.table}
        rowKey="key"
        columns={columns}
        dataSource={rows}
        loading={tableLoading}
        locale={tableLocale}
        pagination={total > 0 ? pagination : false}
        scroll={{ x: 960 }}
        onRow={(row) => ({
          onClick: () => {
            if (row.detailHref) {
              router.push(row.detailHref);
            }
          },
          className: row.detailHref ? "clickable-row" : undefined,
        })}
      />
    </>
  );
}
