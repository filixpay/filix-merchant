"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Skeleton, Tooltip, Typography } from "antd";
import { ArrowLeftRight, ArrowUpRight, FolderOpen, Plus, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ApiError,
  moneyProductApi,
  type MoneyAssetBalance,
  type MoneyAssetCapability,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CreateMoneyInModal from "@/components/money/CreateMoneyInModal";
import CreatePayoutModal from "@/components/money/CreatePayoutModal";
import CreateTransferModal from "@/components/money/CreateTransferModal";
import AssetFlagIcon from "@/components/money/AssetFlagIcon";
import LedgerMovementModal from "@/components/money/LedgerMovementModal";
import { formatMoneyAmount } from "@/lib/money/amount-formatter";
import {
  formatWalletAmountDisplay,
  getWalletRestrictions,
  isWalletHealthy,
  transferCapStatus,
  type WalletRestriction,
} from "@/lib/money/asset-display";
import {
  presentBalanceVisibility,
  type BalanceVisibilityRow,
} from "@/lib/money/balance-visibility";
import { isLedgerMovementBucket } from "@/lib/money/ledger-movement-display";
import { presentMoneyI18nLabel } from "@/lib/money/money-i18n-label";
import { isCreateAvailable } from "@/lib/money/capability-presenter";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import type { MerchantPortalBucket } from "@/lib/api/domains/merchants";
import styles from "./money-balance.module.css";

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

function formatWalletUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
  return date.toLocaleString([], {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function availableAmount(row: BalanceVisibilityRow): string | null {
  const available = row.buckets.find((b) => b.balanceType === "AVAILABLE");
  return available?.amount ?? null;
}

function pendingAmount(row: BalanceVisibilityRow): string | null {
  const pending = row.buckets.find((b) => b.balanceType === "PENDING");
  return pending?.amount ?? null;
}

function formatRestrictionItem(
  t: ReturnType<typeof useTranslations<"MoneyBalance">>,
  restriction: WalletRestriction,
): string {
  const operation = t(`restriction_ops.${restriction.operation}`);
  return t("restriction_item", { operation });
}

function formatRestrictionsSummary(
  t: ReturnType<typeof useTranslations<"MoneyBalance">>,
  restrictions: WalletRestriction[],
): string {
  return restrictions.map((restriction) => formatRestrictionItem(t, restriction)).join("；");
}

function WalletRestrictionTooltip({
  restrictions,
  t,
}: {
  restrictions: WalletRestriction[];
  t: ReturnType<typeof useTranslations<"MoneyBalance">>;
}) {
  return (
    <ul className={styles.statusTooltipList}>
      {restrictions.map((restriction) => (
        <li key={restriction.operation}>{formatRestrictionItem(t, restriction)}</li>
      ))}
    </ul>
  );
}

export default function MoneyBalancePage() {
  const t = useTranslations("MoneyBalance");
  const tCommon = useTranslations("MoneyCommon");
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [rows, setRows] = useState<BalanceVisibilityRow[]>([]);
  const [capsByAsset, setCapsByAsset] = useState<Map<string, MoneyAssetCapability>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [activeAsset, setActiveAsset] = useState<string | null>(null);
  const [showMoneyIn, setShowMoneyIn] = useState(false);
  const [showPayout, setShowPayout] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [movementTarget, setMovementTarget] = useState<{
    assetCode: string;
    bucket: MerchantPortalBucket;
  } | null>(null);

  const load = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const balances: MoneyAssetBalance[] = await moneyProductApi.listBalances(accessToken);
      const capEntries = await Promise.all(
        balances.map(async (b) => {
          const cap: MoneyAssetCapability = await moneyProductApi.getAssetCapability(
            accessToken,
            b.assetCode,
          );
          return [b.assetCode, cap] as const;
        }),
      );
      const caps = new Map<string, MoneyAssetCapability>(capEntries);
      setCapsByAsset(caps);
      setRows(presentBalanceVisibility(balances, caps));
    } catch (err) {
      if (!handleDashboardApiError(err)) {
        setError(err);
        setRows([]);
        setCapsByAsset(new Map());
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const activeRow = useMemo(
    () => rows.find((r) => r.assetCode === activeAsset) ?? null,
    [rows, activeAsset],
  );
  const activeCap = activeAsset ? capsByAsset.get(activeAsset) : undefined;
  const activeAvailable = activeRow ? availableAmount(activeRow) : null;

  const goMoneyIn = () => {
    router.push(`/${locale}/dashboard/money/money-in`);
  };

  const goPayouts = () => {
    router.push(`/${locale}/dashboard/money/payouts`);
  };

  const headerExtra = (
    <div className={styles.headerActions}>
      <Button
        className={styles.headerGhostBtn}
        icon={<ArrowUpRight size={14} strokeWidth={1.75} />}
        onClick={goPayouts}
        disabled={loading || rows.length === 0}
      >
        {t("withdraw_cta")}
      </Button>
      <Button
        type="primary"
        className={styles.headerPrimaryBtn}
        icon={<Plus size={14} strokeWidth={1.75} />}
        onClick={goMoneyIn}
      >
        {t("deposit_cta")}
      </Button>
    </div>
  );

  return (
    <DashboardPage
      title={t("title")}
      subtitle={t("subtitle")}
      contentMode="overview"
      extra={!loading && !error ? headerExtra : undefined}
    >
      {loading ? (
        <div className={styles.skeletonGrid}>
          {[0, 1, 2].map((key) => (
            <div key={key} className={styles.skeletonCard}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <Typography.Text type="danger">{resolveErrorMessage(error)}</Typography.Text>
          <Button onClick={() => void load()}>{t("retry")}</Button>
        </div>
      ) : (
        <>
          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>{t("assets_section_title")}</h3>
              <button
                type="button"
                className={styles.refreshBtn}
                onClick={() => void load()}
                aria-label={t("refresh")}
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {rows.length === 0 ? (
              <div className={styles.emptyPanel}>
                <div className={styles.emptyIcon} aria-hidden>
                  <FolderOpen size={32} strokeWidth={1.5} />
                </div>
                <h4 className={styles.emptyTitle}>{t("empty_title")}</h4>
                <p className={styles.emptyDesc}>{t("empty_desc")}</p>
                <div className={styles.emptyActions}>
                  <Button
                    type="primary"
                    className={styles.emptyPrimaryBtn}
                    icon={<Plus size={14} strokeWidth={1.75} />}
                    onClick={goMoneyIn}
                  >
                    {t("empty_deposit_cta")}
                  </Button>
                  <Button
                    className={styles.emptySecondaryBtn}
                    icon={<RefreshCw size={14} strokeWidth={1.75} />}
                    onClick={() => void load()}
                  >
                    {t("refresh")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`${styles.sectionBody}`}>
                <div className={styles.walletGrid}>
                  {rows.map((row) => {
                    const cap = capsByAsset.get(row.assetCode);
                    const canDeposit = cap ? isCreateAvailable(cap.moneyIn) : false;
                    const canWithdraw = cap ? isCreateAvailable(cap.payout) : false;
                    const canTransfer = cap ? isCreateAvailable(cap.transfer) : false;
                    const available = availableAmount(row);
                    const pending = pendingAmount(row);
                    const walletHealthy = isWalletHealthy(
                      row.moneyIn,
                      row.payout,
                      transferCapStatus(cap),
                    );
                    const restrictions = getWalletRestrictions({
                      moneyIn: row.moneyIn,
                      payout: row.payout,
                      cap,
                    });
                    const amountParts = available
                      ? formatWalletAmountDisplay(available, row.assetCode)
                      : null;

                    return (
                      <article key={row.assetCode} className={styles.walletCard}>
                        <div className={styles.cardTop}>
                          <div className={styles.assetIdentity}>
                            <AssetFlagIcon assetCode={row.assetCode} />
                            <div>
                              <h3 className={styles.assetCode}>{row.assetCode}</h3>
                              <span className={styles.assetAccount}>
                                {t("asset_account", { asset: row.assetCode })}
                              </span>
                            </div>
                          </div>
                          {walletHealthy ? (
                            <span className={`${styles.statusBadge} ${styles.statusHealthy}`}>
                              <span className={`${styles.statusDot} ${styles.statusDotHealthy}`} />
                              {t("status_healthy")}
                            </span>
                          ) : (
                            <Tooltip
                              title={
                                restrictions.length > 0 ? (
                                  <WalletRestrictionTooltip restrictions={restrictions} t={t} />
                                ) : (
                                  t("status_restricted")
                                )
                              }
                              placement="bottomRight"
                              mouseEnterDelay={0.15}
                            >
                              <span
                                className={`${styles.statusBadge} ${styles.statusRestricted} ${styles.statusBadgeInteractive}`}
                                tabIndex={0}
                                role="note"
                                aria-label={
                                  restrictions.length > 0
                                    ? formatRestrictionsSummary(t, restrictions)
                                    : t("status_restricted")
                                }
                              >
                                <span className={`${styles.statusDot} ${styles.statusDotRestricted}`} />
                                {t("status_restricted")}
                              </span>
                            </Tooltip>
                          )}
                        </div>

                        <div className={styles.amountBlock}>
                          <span className={styles.amountLabel}>{t("available")}</span>
                          {amountParts ? (
                            <div className={`${styles.amountValue} financial-amount`}>
                              {amountParts.symbol ? (
                                <span className={styles.amountSymbol}>{amountParts.symbol}</span>
                              ) : null}
                              {amountParts.amount}
                              <span className={styles.amountCode}>{amountParts.assetCode}</span>
                            </div>
                          ) : (
                            <div className={`${styles.amountValue} financial-amount`}>—</div>
                          )}
                          {pending ? (
                            <div className={styles.pendingLine}>
                              {presentMoneyI18nLabel(tCommon, tCommon.has, "balanceTypes", "PENDING")}:{" "}
                              <span className="financial-amount">
                                {formatMoneyAmount(pending, row.assetCode)}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <div className={styles.cardFooter}>
                          <div className={styles.footerMeta}>
                            <span className={styles.updatedAt}>
                              {t("updated_at", { time: formatWalletUpdatedAt(row.asOf) })}
                            </span>
                            {accessToken &&
                            row.buckets.some((b) => isLedgerMovementBucket(b.balanceType)) ? (
                              <Button
                                type="link"
                                className={styles.detailsLink}
                                onClick={() =>
                                  setMovementTarget({
                                    assetCode: row.assetCode,
                                    bucket: "AVAILABLE",
                                  })
                                }
                              >
                                {t("view_details")}
                              </Button>
                            ) : null}
                          </div>
                          <div className={styles.actionGroup}>
                            <Button
                              className={`${styles.actionButton} ${styles.actionGhost}`}
                              disabled={!canTransfer}
                              icon={<ArrowLeftRight size={14} strokeWidth={1.75} />}
                              onClick={() => {
                                setActiveAsset(row.assetCode);
                                setShowTransfer(true);
                              }}
                            >
                              {t("transfer_cta")}
                            </Button>
                            <Button
                              className={`${styles.actionButton} ${styles.actionGhost}`}
                              disabled={!canWithdraw}
                              icon={<ArrowUpRight size={14} strokeWidth={1.75} />}
                              onClick={() => {
                                setActiveAsset(row.assetCode);
                                setShowPayout(true);
                              }}
                            >
                              {t("withdraw_cta")}
                            </Button>
                            <Button
                              type="primary"
                              className={`${styles.actionButton} ${styles.actionPrimary}`}
                              disabled={!canDeposit}
                              icon={<Plus size={14} strokeWidth={1.75} />}
                              onClick={() => {
                                setActiveAsset(row.assetCode);
                                setShowMoneyIn(true);
                              }}
                            >
                              {t("deposit_cta")}
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {accessToken && activeAsset && activeCap && isCreateAvailable(activeCap.moneyIn) ? (
        <CreateMoneyInModal
          open={showMoneyIn}
          onClose={() => setShowMoneyIn(false)}
          onSuccess={() => {
            setShowMoneyIn(false);
            void load();
          }}
          accessToken={accessToken}
          available={activeAvailable}
          assetCode={activeAsset}
          assetOptions={[activeAsset]}
          assetLocked
        />
      ) : null}

      {accessToken && activeAsset && activeCap && isCreateAvailable(activeCap.payout) ? (
        <CreatePayoutModal
          open={showPayout}
          onClose={() => setShowPayout(false)}
          onSuccess={() => {
            setShowPayout(false);
            void load();
          }}
          accessToken={accessToken}
          available={activeAvailable}
          assetCode={activeAsset}
          assetOptions={[activeAsset]}
          assetLocked
        />
      ) : null}

      {accessToken && activeAsset && activeCap && isCreateAvailable(activeCap.transfer) ? (
        <CreateTransferModal
          open={showTransfer}
          onClose={() => setShowTransfer(false)}
          onSuccess={() => {
            setShowTransfer(false);
            void load();
          }}
          accessToken={accessToken}
          available={activeAvailable}
          assetCode={activeAsset}
          assetOptions={[activeAsset]}
          assetLocked
        />
      ) : null}

      {accessToken && movementTarget ? (
        <LedgerMovementModal
          isOpen={!!movementTarget}
          onClose={() => setMovementTarget(null)}
          accessToken={accessToken}
          assetCode={movementTarget.assetCode}
          bucket={movementTarget.bucket}
        />
      ) : null}
    </DashboardPage>
  );
}
