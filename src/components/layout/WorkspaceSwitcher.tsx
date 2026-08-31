"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { message, Skeleton } from "antd";
import { Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import type { OrganizationMerchantView, OrganizationSummaryView } from "@/lib/api";
import {
  getStoredSelectedMerchantCode,
  merchantCodeToString,
} from "./organization-merchant-shell";
import { organizationCodeToString } from "./organization-shell";
import { organizationCanCreateMerchant } from "@/lib/organization/organization-permissions";
import styles from "./OrganizationSwitcher.module.css";

type CopyableCodeMetaProps = {
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
  stopPropagation?: boolean;
};

function CopyableCodeMeta({
  label,
  value,
  copyLabel,
  copiedLabel,
  stopPropagation = false,
}: CopyableCodeMetaProps) {
  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    try {
      await navigator.clipboard.writeText(value);
      message.success(copiedLabel);
    } catch {
      message.error(copyLabel);
    }
  };

  return (
    <div className={styles.optionMetaRow}>
      <span className={styles.optionMeta}>
        {label}: <span className={styles.optionMetaValue}>{value}</span>
      </span>
      <button
        type="button"
        className={styles.copyButton}
        aria-label={copyLabel}
        onClick={(event) => void handleCopy(event)}
      >
        <Copy size={11} strokeWidth={2} />
      </button>
    </div>
  );
}

export type WorkspaceSwitcherProps = {
  organization: OrganizationSummaryView | null;
  organizations?: OrganizationSummaryView[];
  merchants: OrganizationMerchantView[];
  selectedMerchantCode: string | null;
  loading?: boolean;
  onSelectMerchant: (merchant: OrganizationMerchantView) => void;
  onSelectOrganization?: (organization: OrganizationSummaryView) => void;
  /** Same gate as Enterprise Portal access (discoverable enterprises). */
  canAccessEnterprisePortal?: boolean;
};

/**
 * Merchant Portal Workspace Switcher — Merchant-first context selection.
 * Does not switch Organization; does not grant permissions.
 */
export default function WorkspaceSwitcher({
  organization,
  organizations = [],
  merchants,
  selectedMerchantCode,
  loading = false,
  onSelectMerchant,
  onSelectOrganization,
  canAccessEnterprisePortal = false,
}: WorkspaceSwitcherProps) {
  const t = useTranslations("Layout.workspace");
  const tBusiness = useTranslations("Layout.business_account");
  const tOrg = useTranslations("Layout.organization");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const resolvedCode = selectedMerchantCode ?? getStoredSelectedMerchantCode();
  const currentMerchant = merchants.find(
    (merchant) => merchantCodeToString(merchant.merchantCode) === resolvedCode,
  );

  const modeLabel = (mode: OrganizationMerchantView["settlementMode"]) =>
    mode === "PLATFORM" ? tBusiness("mode.platform") : tBusiness("mode.direct");

  const handleSelectMerchant = (merchant: OrganizationMerchantView) => {
    if (merchantCodeToString(merchant.merchantCode) === resolvedCode) {
      setIsOpen(false);
      return;
    }
    onSelectMerchant(merchant);
    setIsOpen(false);
  };

  const resolvedOrgCode = organization ? organizationCodeToString(organization.code) : null;

  const handleSelectOrganization = (nextOrganization: OrganizationSummaryView) => {
    const nextCode = organizationCodeToString(nextOrganization.code);
    if (nextCode === resolvedOrgCode) {
      setIsOpen(false);
      return;
    }
    onSelectOrganization?.(nextOrganization);
    setIsOpen(false);
  };

  const formatOrgRoles = (roles: OrganizationSummaryView["roles"]) =>
    roles.length ? roles.join(", ") : tOrg("no_roles");

  if (loading && merchants.length === 0 && !organization) {
    return (
      <div className={styles.container}>
        <div className={styles.summarySkeleton}>
          <Skeleton active paragraph={{ rows: 1 }} title={false} />
        </div>
      </div>
    );
  }

  if (!organization && merchants.length === 0) {
    return null;
  }

  const primaryName = currentMerchant?.name || organization?.name || t("workspace");
  const secondaryName = currentMerchant
    ? modeLabel(currentMerchant.settlementMode)
    : "";

  const canCreateBusinessAccount = organization
    ? organizationCanCreateMerchant(organization.roles)
    : false;

  return (
    <div className={styles.container}>
      <div className={styles.switcher}>
        <button
          type="button"
          className={`${styles.summary} ${isOpen ? styles.active : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className={styles.summaryContent}>
            <div className={styles.summaryIcon}>
              <BuildingStorefrontIcon className={styles.icon} />
            </div>
            <div className={styles.summaryText}>
              <div className={styles.summaryTitle}>{primaryName}</div>
              {secondaryName ? (
                <div className={styles.summaryDesc}>{secondaryName}</div>
              ) : null}
            </div>
          </div>
          <ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.rotate : ""}`} />
        </button>

        {isOpen && (
          <div className={styles.dropdown} role="listbox">
            <div className={styles.sectionHeader}>
              <div className={styles.sectionLabel}>{t("switch_business_account")}</div>
            </div>
            {merchants.length === 0 ? (
              <div className={styles.emptyHint}>{t("no_business_accounts")}</div>
            ) : (
              merchants.map((merchant) => {
                const code = merchantCodeToString(merchant.merchantCode);
                const isSelected = code === resolvedCode;
                return (
                  <button
                    type="button"
                    key={code}
                    className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                    onClick={() => handleSelectMerchant(merchant)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className={styles.optionIcon}>
                      <BuildingStorefrontIcon className={styles.icon} />
                    </div>
                    <div className={styles.optionContent}>
                      <div className={styles.optionTitle}>{merchant.name}</div>
                      <div className={styles.optionDesc}>{modeLabel(merchant.settlementMode)}</div>
                      <CopyableCodeMeta
                        label={tBusiness("account_code")}
                        value={code}
                        copyLabel={t("copy_code")}
                        copiedLabel={t("copy_success")}
                        stopPropagation
                      />
                    </div>
                    {isSelected ? <CheckCircleIcon className={styles.checkIcon} /> : null}
                  </button>
                );
              })
            )}

            {organizations.length > 1 ? (
              <>
                <div className={styles.divider} />
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionLabel}>{t("switch_organization")}</div>
                  {canCreateBusinessAccount ? (
                    <Link
                      href={`/${locale}/dashboard/organization?create=1`}
                      className={styles.sectionAddLink}
                      aria-label={t("add_business_account")}
                      onClick={() => setIsOpen(false)}
                    >
                      +
                    </Link>
                  ) : null}
                </div>
                {organizations.map((item) => {
                  const code = organizationCodeToString(item.code);
                  const isSelected = code === resolvedOrgCode;
                  return (
                    <button
                      type="button"
                      key={code}
                      className={`${styles.option} ${isSelected ? styles.selected : ""}`}
                      onClick={() => handleSelectOrganization(item)}
                    >
                      <div className={styles.optionIcon}>
                        <BuildingOffice2Icon className={styles.icon} />
                      </div>
                      <div className={styles.optionContent}>
                        <div className={styles.optionTitle}>{item.name}</div>
                        <div className={styles.optionDesc}>
                          {tOrg("org_code")}: {code} · {formatOrgRoles(item.roles)}
                        </div>
                      </div>
                      {isSelected ? <CheckCircleIcon className={styles.checkIcon} /> : null}
                    </button>
                  );
                })}
              </>
            ) : organization ? (
              <>
                <div className={styles.divider} />
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionLabel}>{t("affiliated_organization")}</div>
                  <a
                    href={`https://www.filixpay.com/${locale}/dashboard/organization`}
                    className={styles.sectionAddLink}
                    aria-label={t("add_organization")}
                    onClick={() => setIsOpen(false)}
                  >
                    +
                  </a>
                </div>
                <div className={styles.detailBlock}>
                  <div className={styles.detailBody}>{organization.name}</div>
                  <CopyableCodeMeta
                    label={tOrg("org_code")}
                    value={organizationCodeToString(organization.code)}
                    copyLabel={t("copy_code")}
                    copiedLabel={t("copy_success")}
                  />
                </div>
              </>
            ) : null}

            {canAccessEnterprisePortal ? (
              <>
                <div className={styles.divider} />
                <Link
                  href={`/${locale}/enterprise/dashboard`}
                  className={styles.footerLink}
                  onClick={() => setIsOpen(false)}
                >
                  <Cog6ToothIcon className={styles.footerIcon} />
                  {t("manage_organization")}
                </Link>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
