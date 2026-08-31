"use client";

import { useState } from "react";
import { Button, Popconfirm, Space, Table, message } from "antd";
import { Building2, Check, Copy, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useTranslations } from "next-intl";
import type { BankAccountView } from "@/lib/api";
import { useDashboardTableFeedback } from "@/lib/dashboard/use-dashboard-table-feedback";
import {
  formatBankAccountDateTime,
  getBankAccountStatusLabel,
  resolveBankAccountDisplayMask,
  resolveBankAccountNumber,
} from "./bank-account-model";
import styles from "./BankAccountTable.module.css";

interface BankAccountTableProps {
  bankAccounts: BankAccountView[];
  loading: boolean;
  isRefreshing?: boolean;
  error?: unknown | null;
  onRetry?: () => void;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string | number) => Promise<void>;
}

function AccountNumberCell({ account }: { account: BankAccountView }) {
  const t = useTranslations("BankAccounts");
  const raw = resolveBankAccountNumber(account);
  const display = resolveBankAccountDisplayMask(account);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!raw) return;
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      message.success(t("copied"));
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      message.error(t("copy_failed"));
    }
  };

  if (display === "—") {
    return <span className={styles.accountText}>—</span>;
  }

  return (
    <div className={styles.accountChip}>
      <span className={styles.accountText}>{display}</span>
      {raw ? (
        <button
          type="button"
          className={`${styles.copyBtn} ${copied ? styles.copyDone : ""}`}
          onClick={() => void handleCopy()}
          title={t("copy_account")}
          aria-label={t("copy_account")}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      ) : null}
    </div>
  );
}

export default function BankAccountTable({
  bankAccounts,
  loading,
  isRefreshing = false,
  error = null,
  onRetry,
  total,
  page,
  pageSize,
  onPageChange,
  onDelete,
}: BankAccountTableProps) {
  const t = useTranslations("BankAccounts");
  const tCommon = useTranslations("Common");

  const handleDelete = async (id: string | number) => {
    try {
      await onDelete(id);
      message.success(tCommon("success"));
    } catch {
      message.error(tCommon("error"));
    }
  };

  const columns: ColumnsType<BankAccountView> = [
    {
      title: t("headers.bank_branch"),
      key: "bank",
      width: 260,
      render: (_, account) => (
        <div className={styles.bankCell}>
          <div className={styles.bankIcon}>
            <Building2 size={18} />
          </div>
          <div>
            <div className={styles.bankTitleRow}>
              <span className={styles.bankName}>{account.bankName}</span>
              {account.primary ? <span className={styles.primaryBadge}>{t("primary_badge")}</span> : null}
            </div>
            <span className={styles.branchName}>{account.bankBranchName || "—"}</span>
          </div>
        </div>
      ),
    },
    {
      title: t("headers.account_holder"),
      dataIndex: "bankAccountHolder",
      key: "bankAccountHolder",
      width: 160,
      render: (holder: string) => <span className={styles.holderText}>{holder || "—"}</span>,
    },
    {
      title: t("headers.account_number"),
      key: "accountNumber",
      width: 220,
      render: (_, account) => <AccountNumberCell account={account} />,
    },
    {
      title: t("headers.city"),
      dataIndex: "city",
      key: "city",
      width: 100,
      render: (city: string) => <span className={styles.cityText}>{city || "—"}</span>,
    },
    {
      title: t("headers.status"),
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => {
        const active = status === "ACTIVE";
        return (
          <span
            className={`${styles.statusPill} ${active ? styles.statusActive : styles.statusInactive}`}
          >
            <span className={styles.statusDot} />
            {getBankAccountStatusLabel(status, (key) => t(`status_values.${key}`))}
          </span>
        );
      },
    },
    {
      title: t("headers.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (value) => <span className={styles.timeText}>{formatBankAccountDateTime(value)}</span>,
    },
    {
      title: tCommon("actions"),
      key: "actions",
      align: "right",
      width: 72,
      render: (_, account) => (
        <Popconfirm title={tCommon("confirm_delete")} onConfirm={() => handleDelete(account.id)}>
          <Button
            type="text"
            size="small"
            className={`${styles.actionBtn} ${styles.actionDanger}`}
            icon={<Trash2 size={15} />}
            title={tCommon("delete")}
          />
        </Popconfirm>
      ),
    },
  ];

  const { tableLoading, locale, refreshBanner } = useDashboardTableFeedback({
    loading,
    isRefreshing,
    error,
    rowCount: bankAccounts.length,
    emptyDescription: t("empty"),
    onRetry,
  });

  return (
    <Space direction="vertical" size={12} style={{ width: "100%" }}>
      {refreshBanner}
      <div className={styles.panel}>
        <Table
          className={styles.table}
          columns={columns}
          dataSource={bankAccounts}
          rowKey="id"
          loading={tableLoading}
          size="middle"
          scroll={{ x: 1040 }}
          locale={locale}
          pagination={{
            current: page + 1,
            pageSize,
            total,
            showSizeChanger: false,
            onChange: (p) => onPageChange(p - 1),
          }}
        />
      </div>
    </Space>
  );
}
