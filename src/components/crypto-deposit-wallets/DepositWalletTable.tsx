"use client";

import { useState } from "react";
import { Button, Table, message } from "antd";
import { Check, Copy, Edit3, Plus, Wallet } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { CryptoDepositWalletView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
  formatDepositWalletDateTime,
  getChainBadgeShort,
  getChainProtocolLabel,
} from "./deposit-wallet-model";
import styles from "./DepositWalletTable.module.css";

interface DepositWalletTableProps {
  wallets: CryptoDepositWalletView[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  canManage: boolean;
  onCreate?: () => void;
  onEdit?: (wallet: CryptoDepositWalletView) => void;
  onToggleStatus?: (wallet: CryptoDepositWalletView) => void;
}

function chainBadgeClass(chainCode: string): string {
  const chain = chainCode.toUpperCase();
  if (chain === "TRON" || chain === "TRX") return styles.chainBadgeTron;
  if (chain === "ETH" || chain === "ETHEREUM") return styles.chainBadgeEth;
  if (chain === "BSC" || chain === "BNB") return styles.chainBadgeBsc;
  return styles.chainBadgeDefault;
}

function AddressCell({ address }: { address: string }) {
  const t = useTranslations("CryptoDepositWallets");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      message.success(t("copied"));
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      message.error(t("copy_failed"));
    }
  };

  return (
    <div className={styles.addressChip}>
      <span className={styles.addressText}>{address}</span>
      <button
        type="button"
        className={`${styles.copyBtn} ${copied ? styles.copyDone : ""}`}
        onClick={() => void handleCopy()}
        title={t("copy_address")}
        aria-label={t("copy_address")}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  );
}

export default function DepositWalletTable({
  wallets,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  canManage,
  onCreate,
  onEdit,
  onToggleStatus,
}: DepositWalletTableProps) {
  const t = useTranslations("CryptoDepositWallets");
  const tCommon = useTranslations("Common");

  const columns: ColumnsType<CryptoDepositWalletView> = [
    {
      title: t("headers.network"),
      key: "network",
      width: 160,
      render: (_, record) => (
        <div className={styles.chainCell}>
          <span className={`${styles.chainBadge} ${chainBadgeClass(record.chainCode)}`}>
            {getChainBadgeShort(record.chainCode)}
          </span>
          <div>
            <span className={styles.chainName}>{record.chainCode}</span>
            <span className={styles.chainProtocol}>
              {getChainProtocolLabel(record.chainCode, record.network)}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t("headers.asset"),
      dataIndex: "assetCode",
      key: "asset",
      width: 100,
      render: (assetCode: string) => <span className={styles.assetText}>{assetCode}</span>,
    },
    {
      title: t("headers.address"),
      dataIndex: "depositAddress",
      key: "depositAddress",
      render: (address: string) => <AddressCell address={address} />,
    },
    {
      title: t("headers.label"),
      dataIndex: "label",
      key: "label",
      width: 140,
      render: (label) => label || "—",
    },
    {
      title: t("headers.status"),
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string, record) => {
        const active = status === "ACTIVE";
        return (
          <span
            className={[
              styles.statusPill,
              active ? styles.statusActive : styles.statusInactive,
              canManage ? styles.statusClickable : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={canManage ? () => onToggleStatus?.(record) : undefined}
            role={canManage ? "button" : undefined}
            tabIndex={canManage ? 0 : undefined}
            onKeyDown={
              canManage
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onToggleStatus?.(record);
                    }
                  }
                : undefined
            }
          >
            <span className={styles.statusDot} />
            {active ? t("status.active") : t("status.inactive")}
          </span>
        );
      },
    },
    {
      title: t("headers.updated_at"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 170,
      render: (value) => <span className={styles.timeText}>{formatDepositWalletDateTime(value)}</span>,
    },
    ...(canManage
      ? [
          {
            title: tCommon("actions"),
            key: "actions",
            align: "right" as const,
            width: 72,
            render: (_: unknown, record: CryptoDepositWalletView) => (
              <Button
                type="text"
                size="small"
                icon={<Edit3 size={15} />}
                onClick={() => onEdit?.(record)}
                title={tCommon("edit")}
              />
            ),
          },
        ]
      : []),
  ];

  const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: wallets.length,
    emptyDescription: t("empty"),
    onRetry,
  });

  const showGuidedEmpty = !loading && !error && wallets.length === 0;

  return (
    <div className={styles.panel}>
      {refreshBanner ? <div style={{ padding: 12 }}>{refreshBanner}</div> : null}

      {showGuidedEmpty ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Wallet size={24} />
          </div>
          <p className={styles.emptyTitle}>{t("empty_title")}</p>
          <p className={styles.emptyDesc}>{t("empty_desc")}</p>
          {canManage && onCreate ? (
            <div className={styles.emptyCta}>
              <Button type="primary" ghost icon={<Plus size={14} />} onClick={onCreate}>
                {t("empty_cta")}
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <Table
          className={styles.table}
          columns={columns}
          dataSource={wallets}
          rowKey="id"
          loading={tableLoading}
          size="middle"
          scroll={{ x: 980 }}
          locale={locale}
          pagination={false}
        />
      )}
    </div>
  );
}
