"use client";

import { useMemo, useState } from "react";
import { Button, Dropdown, Modal, Table, message } from "antd";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Ban, Building2, Check, Copy, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ExternalAccountView } from "@/lib/api";
import styles from "./ExternalAccountTable.module.css";

export interface ExternalAccountTableProps {
  accounts: ExternalAccountView[];
  loading: boolean;
  onDisable: (id: string) => Promise<void>;
}

function isCrypto(account: ExternalAccountView): boolean {
  return account.type === "CRYPTO";
}

function maskLabel(account: ExternalAccountView): string {
  if (isCrypto(account)) {
    const last4 = account.addressLast4?.trim();
    if (last4) return `•••• ${last4}`;
    return account.addressMasked?.trim() || "—";
  }
  const last4 = account.accountNumberLast4?.trim();
  if (last4) return `•••• ${last4}`;
  const masked = account.accountNumberMasked?.trim();
  return masked || "—";
}

function countryFlagPath(country: string): string | null {
  const code = country.trim().toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) return null;
  return `/flags/${code}.svg`;
}

function regionDisplayName(country: string, locale: string): string {
  const code = country.trim().toUpperCase();
  if (!code) return "—";
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function AccountNumberCell({ account }: { account: ExternalAccountView }) {
  const t = useTranslations("MoneyExternalAccounts");
  const label = maskLabel(account);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (label === "—") return;
    try {
      await navigator.clipboard.writeText(label);
      setCopied(true);
      message.success(t("copy_success"));
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      message.error(t("copy_failed"));
    }
  };

  return (
    <div className={styles.accountChip}>
      <span className={styles.accountText}>{label}</span>
      {label !== "—" ? (
        <button
          type="button"
          className={`${styles.copyBtn} ${copied ? styles.copyDone : ""}`}
          onClick={() => void handleCopy()}
          title={isCrypto(account) ? t("copy_masked_address") : t("copy_masked")}
          aria-label={isCrypto(account) ? t("copy_masked_address") : t("copy_masked")}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
      ) : null}
    </div>
  );
}

function CountryCell({ country }: { country: string }) {
  const locale = useLocale();
  const code = country.trim().toUpperCase();
  const flagPath = countryFlagPath(code);
  const name = regionDisplayName(code, locale);

  if (!code) return <span>—</span>;

  return (
    <div className={styles.countryCell}>
      {flagPath ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={flagPath} alt="" width={16} height={16} className={styles.flag} loading="lazy" />
      ) : (
        <span className={styles.flagFallback} aria-hidden>
          {code.slice(0, 2)}
        </span>
      )}
      <span className={styles.countryName}>{name}</span>
      <span className={styles.countryCode}>({code})</span>
    </div>
  );
}

export default function ExternalAccountTable({
  accounts,
  loading,
  onDisable,
}: ExternalAccountTableProps) {
  const t = useTranslations("MoneyExternalAccounts");

  const columns: ColumnsType<ExternalAccountView> = useMemo(
    () => [
      {
        title: t("columns.type"),
        dataIndex: "type",
        key: "type",
        width: 100,
        render: (type: string) => (
          <span className={styles.currencyChip}>
            {type === "CRYPTO" ? t("type_crypto") : t("type_bank")}
          </span>
        ),
      },
      {
        title: t("columns.account"),
        key: "account",
        width: 180,
        render: (_, row) => <AccountNumberCell account={row} />,
      },
      {
        title: t("columns.holder"),
        key: "holder",
        render: (_, row) =>
          isCrypto(row) ? (
            <span className={styles.holderText}>
              {(row.network || "").trim().toUpperCase() || "—"}
              {row.memoTagPresent ? ` · ${t("memo_present")}` : ""}
            </span>
          ) : (
            <span className={styles.holderText}>{row.accountHolderName?.trim() || "—"}</span>
          ),
      },
      {
        title: t("columns.bank"),
        key: "bank",
        render: (_, row) =>
          isCrypto(row) ? (
            <span className={styles.bankName}>—</span>
          ) : (
            <div className={styles.bankCell}>
              <div className={styles.bankIcon}>
                <Building2 size={14} />
              </div>
              <span className={styles.bankName}>{row.bankName?.trim() || "—"}</span>
            </div>
          ),
      },
      {
        title: t("columns.currency"),
        key: "currency",
        width: 90,
        render: (_, row) =>
          isCrypto(row) ? (
            <span className={styles.currencyChip}>—</span>
          ) : (
            <span className={styles.currencyChip}>
              {(row.currency || "").trim().toUpperCase() || "—"}
            </span>
          ),
      },
      {
        title: t("columns.country"),
        key: "country",
        width: 160,
        render: (_, row) =>
          isCrypto(row) ? <span>—</span> : <CountryCell country={row.country ?? ""} />,
      },
      {
        title: t("columns.status"),
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: string) => {
          const active = status === "ACTIVE";
          return (
            <span
              className={`${styles.statusPill} ${active ? styles.statusActive : styles.statusInactive}`}
            >
              <span className={styles.statusDot} />
              {active ? t("status_active") : t("status_disabled")}
            </span>
          );
        },
      },
      {
        title: t("columns.actions"),
        key: "actions",
        width: 72,
        align: "right",
        render: (_, row) => {
          if (row.status !== "ACTIVE") {
            return <span className={styles.actionsEmpty}>—</span>;
          }

          const items: MenuProps["items"] = [
            {
              key: "disable",
              danger: true,
              icon: <Ban size={14} />,
              label: t("disable"),
              onClick: () => {
                Modal.confirm({
                  title: t("disable_confirm"),
                  content: t("disable_confirm_desc"),
                  okText: t("disable"),
                  cancelText: t("create.cancel"),
                  okButtonProps: { danger: true },
                  centered: true,
                  onOk: async () => {
                    try {
                      await onDisable(row.id);
                      message.success(t("disable_success"));
                    } catch {
                      message.error(t("disable_failed"));
                      return Promise.reject();
                    }
                  },
                });
              },
            },
          ];

          return (
            <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
              <Button
                type="text"
                size="small"
                className={styles.moreBtn}
                icon={<MoreHorizontal size={16} />}
                aria-label={t("columns.actions")}
              />
            </Dropdown>
          );
        },
      },
    ],
    [onDisable, t],
  );

  return (
    <div className={styles.panel}>
      <Table
        className={styles.table}
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={accounts}
        pagination={false}
      />
    </div>
  );
}
