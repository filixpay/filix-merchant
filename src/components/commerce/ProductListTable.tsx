"use client";

import Link from "next/link";
import { Button, Dropdown, Image, Space, Table, Tag, Typography } from "antd";
import type { ColumnsType, TableRowSelection } from "antd/es/table/interface";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CommerceProductView } from "@/lib/api/domains/commerce";
import { canPublish, canRetrySync, canUnpublish } from "@/lib/api/domains/commerce";
import { formatCommercePrice } from "./format-commerce-price";
import ProductListStatusBadge from "./ProductListStatusBadge";
import styles from "./ProductListTable.module.css";

const LOW_STOCK_THRESHOLD = 10;

type ProductListTableProps = {
  products: CommerceProductView[];
  loading: boolean;
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
  onPublish?: (product: CommerceProductView) => void;
  onUnpublish?: (product: CommerceProductView) => void;
  onRetrySync?: (product: CommerceProductView) => void;
  onDelete?: (product: CommerceProductView) => void;
  actionLoadingId?: string | null;
};

function StockCell({ stock }: { stock: number }) {
  const t = useTranslations("CommerceProducts");
  const isOut = stock <= 0;
  const isLow = !isOut && stock <= LOW_STOCK_THRESHOLD;

  return (
    <div className={styles.stockCell}>
      <span className={`${styles.stockValue} ${isOut ? styles.stockOut : isLow ? styles.stockLow : ""}`}>
        {stock}
      </span>
      {isOut ? (
        <Tag color="error" className={styles.stockTagOut}>
          {t("stock.out_of_stock")}
        </Tag>
      ) : isLow ? (
        <Tag color="warning" className={styles.stockTagLow}>
          {t("stock.low")}
        </Tag>
      ) : null}
    </div>
  );
}

export default function ProductListTable({
  products,
  loading,
  selectedRowKeys,
  onSelectionChange,
  onPublish,
  onUnpublish,
  onRetrySync,
  onDelete,
  actionLoadingId,
}: ProductListTableProps) {
  const locale = useLocale();
  const t = useTranslations("CommerceProducts");

  const rowSelection: TableRowSelection<CommerceProductView> = {
    selectedRowKeys,
    onChange: (keys) => onSelectionChange(keys.map(String)),
  };

  const columns: ColumnsType<CommerceProductView> = [
    {
      title: t("columns.thumbnail"),
      key: "thumbnail",
      width: 56,
      render: (_: unknown, record) => {
        const src = record.images[0];
        if (!src) {
          return <span className={styles.thumbnailPlaceholder}>—</span>;
        }
        return (
          <Image
            src={src}
            alt=""
            width={40}
            height={40}
            className={styles.thumbnail}
            preview={false}
          />
        );
      },
    },
    {
      title: t("columns.title"),
      dataIndex: "title",
      key: "title",
      render: (title: string, record) => (
        <Link href={`/${locale}/dashboard/commerce/products/${record.id}`}>{title}</Link>
      ),
    },
    { title: t("columns.sku"), dataIndex: "sku", key: "sku", width: 140 },
    {
      title: t("columns.price"),
      key: "price",
      align: "right",
      width: 120,
      render: (_: unknown, record) => (
        <span className={styles.priceCell}>{formatCommercePrice(record.price, locale)}</span>
      ),
    },
    {
      title: t("columns.stock"),
      key: "stock",
      width: 120,
      render: (_: unknown, record) => <StockCell stock={record.stock} />,
    },
    {
      title: t("columns.status"),
      key: "status",
      width: 120,
      render: (_: unknown, record) => <ProductListStatusBadge product={record} />,
    },
    {
      title: t("columns.updated"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 170,
      render: (value?: string) => (value ? new Date(value).toLocaleString(locale) : "—"),
    },
    {
      title: t("columns.actions"),
      key: "actions",
      width: 160,
      fixed: "right",
      render: (_: unknown, record) => {
        const busy = actionLoadingId === record.id;
        const menuItems = [
          canRetrySync(record) && onRetrySync
            ? {
                key: "retry",
                label: t("actions.retry_sync"),
                onClick: () => onRetrySync(record),
              }
            : null,
          onDelete
            ? {
                key: "delete",
                label: t("actions.delete"),
                danger: true,
                onClick: () => onDelete(record),
              }
            : null,
        ].filter(Boolean) as { key: string; label: string; danger?: boolean; onClick: () => void }[];

        return (
          <Space size={4}>
            <Link href={`/${locale}/dashboard/commerce/products/${record.id}`} className={styles.detailLink}>
              {t("actions.edit")}
              <ChevronRight size={13} strokeWidth={2} />
            </Link>
            {canPublish(record) && onPublish ? (
              <Button size="small" type="link" loading={busy} onClick={() => onPublish(record)}>
                {t("actions.publish")}
              </Button>
            ) : null}
            {canUnpublish(record) && onUnpublish ? (
              <Button size="small" type="link" loading={busy} onClick={() => onUnpublish(record)}>
                {t("actions.unpublish")}
              </Button>
            ) : null}
            {menuItems.length > 0 ? (
              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <Button
                  type="text"
                  size="small"
                  className={styles.moreButton}
                  icon={<MoreHorizontal size={16} />}
                  aria-label={t("actions.more")}
                />
              </Dropdown>
            ) : null}
          </Space>
        );
      },
    },
  ];

  return (
    <div className={styles.tableWrap}>
      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={products}
        pagination={false}
        rowSelection={rowSelection}
        scroll={{ x: 1100 }}
        locale={{ emptyText: <Typography.Text type="secondary">{t("empty")}</Typography.Text> }}
      />
    </div>
  );
}
