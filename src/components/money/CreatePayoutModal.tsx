"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Form, Input, Modal, Select, message } from "antd";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import PaymentPinInput from "@/components/money/PaymentPinInput";
import { ApiError, moneyProductApi, type ExternalAccountView } from "@/lib/api";
import { formatMoneyAmount } from "@/lib/money/amount-formatter";
import { shouldWarnAmountExceedsAvailable } from "@/lib/money/amount-hint";
import { buildPayoutCreateRequest } from "@/lib/money/build-payout-create-request";
import { ClientRequestIdAttempt } from "@/lib/money/client-request-id-attempt";
import { assertValidClientRequestId } from "@/lib/money/client-request-id";
import { moneyExternalAccountsPath } from "@/lib/money/external-accounts-redirect";
import { moneyPayoutsDetailPath } from "@/lib/money/money-payouts-redirect";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import { normalizePagedResponse } from "@/lib/dashboard/normalize-paged-response";
import { filterPayoutDestinations } from "./external-account-form-model";
import styles from "./CreatePayoutModal.module.css";

export interface CreatePayoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string;
  /** Available balance decimal string for UX hint only — not mutated. */
  available: string | null;
  assetCode: string;
  /** When set, replaces the default currency catalog in the asset Select. */
  assetOptions?: string[];
  /** Lock asset Select to the provided assetCode. */
  assetLocked?: boolean;
}

type Step = "entry" | "confirm";

interface EntryFormValues {
  assetCode: string;
  amount: string;
  destinationAccountId: string;
}

interface ConfirmFormValues {
  paymentPin: string;
}

function resolveErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    const code = String(error.code ?? "").trim();
    if (code === "PIN_NOT_SET") {
      return error.message || t("create.errors.pinNotSet");
    }
    if (code === "INCORRECT_PIN" || code === "MAX_ATTEMPTS_EXCEEDED") {
      return error.message || t("create.errors.pinIncorrect");
    }
    if (code === "PAYMENT_PIN_REQUIRED") {
      return t("create.validation.pinRequired");
    }
    const data = error.data as { reasonCode?: string } | undefined;
    return presentMoneyProductError({
      reasonCode: data?.reasonCode,
      code: error.code,
      message: error.message,
    });
  }
  return presentMoneyProductError({});
}

function externalAccountLabel(account: ExternalAccountView): string {
  if (account.type === "CRYPTO") {
    const network = (account.network || "").trim().toUpperCase() || "—";
    const last4 = account.addressLast4?.trim();
    const masked = last4
      ? `•••• ${last4}`
      : account.addressMasked?.trim() || "—";
    return `CRYPTO · ${network} · ${masked}`;
  }
  const bank = account.bankName?.trim() || "—";
  const holder = account.accountHolderName?.trim() || "—";
  const last4 = account.accountNumberLast4?.trim();
  const masked = last4
    ? `•••• ${last4}`
    : account.accountNumberMasked?.trim() || "—";
  const currency = (account.currency || "").trim().toUpperCase() || "—";
  return `${bank} · ${holder} · ${masked} · ${currency}`;
}

export default function CreatePayoutModal({
  open,
  onClose,
  onSuccess,
  accessToken,
  available,
  assetCode,
  assetOptions,
  assetLocked = false,
}: CreatePayoutModalProps) {
  const t = useTranslations("MoneyPayouts");
  const locale = useLocale();
  const router = useRouter();
  const [entryForm] = Form.useForm<EntryFormValues>();
  const [confirmForm] = Form.useForm<ConfirmFormValues>();
  const [step, setStep] = useState<Step>("entry");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitErrorCode, setSubmitErrorCode] = useState<string | null>(null);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [externalAccounts, setExternalAccounts] = useState<ExternalAccountView[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [confirmedEntry, setConfirmedEntry] = useState<EntryFormValues | null>(null);
  const attemptRef = useRef<ClientRequestIdAttempt | null>(null);

  const amountWatch = Form.useWatch("amount", entryForm) ?? "";
  const assetWatch = Form.useWatch("assetCode", entryForm) ?? assetCode;
  const pinWatch = Form.useWatch("paymentPin", confirmForm);
  const pinSettingsPath = `/${locale}/dashboard/security-settings/transaction-password`;
  const externalAccountsPath = moneyExternalAccountsPath(locale);
  const selectOptions = (assetOptions?.length ? assetOptions : ["CNY", "USD", "EUR", "HKD", "JPY", "GBP"]).map(
    (code) => ({ value: code, label: code }),
  );

  const amountExceeds =
    available != null && shouldWarnAmountExceedsAvailable(amountWatch, available);
  const amountPositive = (() => {
    const n = Number(amountWatch);
    return Number.isFinite(n) && n > 0;
  })();

  const activeAccounts = useMemo(
    () => filterPayoutDestinations(externalAccounts, assetWatch || assetCode),
    [externalAccounts, assetWatch, assetCode],
  );

  const hasAccounts = activeAccounts.length > 0;
  const canGoNext =
    amountPositive && !accountsLoading && hasAccounts && Boolean(selectedAccountId);

  useEffect(() => {
    if (!open) return;
    setStep("entry");
    setSubmitting(false);
    setSubmitError(null);
    setSubmitErrorCode(null);
    setConfirmedEntry(null);
    attemptRef.current = new ClientRequestIdAttempt();
    entryForm.resetFields();
    entryForm.setFieldsValue({
      assetCode,
      amount: "",
      destinationAccountId: "",
    });
    confirmForm.resetFields();
    setSelectedAccountId("");

    let cancelled = false;
    (async () => {
      setAccountsLoading(true);
      try {
        const page = await moneyProductApi.listExternalAccounts(
          { page: 0, size: 100 },
          accessToken,
        );
        const { items } = normalizePagedResponse(page);
        if (cancelled) return;
        setExternalAccounts(items);
        const eligible = filterPayoutDestinations(items, assetCode);
        const primary = eligible[0];
        if (primary) {
          setSelectedAccountId(primary.id);
          entryForm.setFieldsValue({ destinationAccountId: primary.id });
        }
      } catch {
        if (!cancelled) setExternalAccounts([]);
      } finally {
        if (!cancelled) setAccountsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, accessToken, assetCode, entryForm, confirmForm]);

  useEffect(() => {
    if (!open) return;
    const eligible = filterPayoutDestinations(externalAccounts, assetWatch || assetCode);
    const stillValid = eligible.some((a) => a.id === selectedAccountId);
    if (stillValid) return;
    const primary = eligible[0];
    setSelectedAccountId(primary?.id ?? "");
    entryForm.setFieldsValue({ destinationAccountId: primary?.id ?? "" });
  }, [open, externalAccounts, assetWatch, assetCode, selectedAccountId, entryForm]);

  const applyExternalAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    entryForm.setFieldsValue({ destinationAccountId: accountId });
  };

  const handleEntryNext = async () => {
    try {
      const values = await entryForm.validateFields();
      if (available != null && shouldWarnAmountExceedsAvailable(values.amount, available)) {
        setSubmitError(t("create.amount_exceeds_hint"));
        setSubmitErrorCode(null);
        return;
      }
      if (!values.destinationAccountId) {
        setSubmitError(t("create.account_required"));
        setSubmitErrorCode(null);
        return;
      }
      setSubmitError(null);
      setSubmitErrorCode(null);
      setConfirmedEntry(values);
      confirmForm.resetFields();
      setStep("confirm");
    } catch {
      // validation errors shown by Form
    }
  };

  const handleConfirm = async () => {
    if (!confirmedEntry) return;

    try {
      const pinValues = await confirmForm.validateFields();
      if (!/^\d{6}$/.test(pinValues.paymentPin)) {
        return;
      }

      const attempt = attemptRef.current ?? new ClientRequestIdAttempt();
      attemptRef.current = attempt;
      const clientRequestId = assertValidClientRequestId(attempt.current());

      setSubmitting(true);
      setSubmitError(null);
      setSubmitErrorCode(null);
      try {
        const created = await moneyProductApi.createPayout(
          buildPayoutCreateRequest({
            assetCode: confirmedEntry.assetCode,
            amount: confirmedEntry.amount,
            clientRequestId,
            paymentPin: pinValues.paymentPin,
            destinationAccountId: confirmedEntry.destinationAccountId,
          }),
          accessToken,
        );
        if (created.nextAction?.type === "RUNTIME_CONTINUE") {
          message.warning(
            t("create.runtime_continue_warning", {
              reasonCode: created.nextAction.reasonCode ?? "UNKNOWN",
            }),
          );
        } else {
          message.success(t("create.success"));
        }
        onSuccess();
        onClose();
        router.push(moneyPayoutsDetailPath(locale, created.payoutId));
      } catch (err) {
        const code = err instanceof ApiError ? String(err.code ?? "").trim() : "";
        setSubmitErrorCode(code || null);
        setSubmitError(resolveErrorMessage(err, t));
      } finally {
        setSubmitting(false);
      }
    } catch {
      // validation errors shown by Form
    }
  };

  const handleCancel = () => {
    if (!submitting) onClose();
  };

  const accountOptions = useMemo(
    () =>
      activeAccounts.map((account) => ({
        value: account.id,
        label: externalAccountLabel(account),
      })),
    [activeAccounts],
  );

  const formattedAvailable =
    available != null ? formatMoneyAmount(available, assetWatch, locale) : null;
  const confirmAsset = confirmedEntry?.assetCode ?? assetWatch;
  const confirmAmountRaw = confirmedEntry?.amount?.trim() ?? "";
  const formattedApplyAmount =
    confirmAmountRaw && /^-?\d+(\.\d+)?$/.test(confirmAmountRaw)
      ? formatMoneyAmount(confirmAmountRaw, confirmAsset, locale)
      : "—";
  const confirmDestinationLabel = (() => {
    if (!confirmedEntry) return "—";
    const saved = externalAccounts.find((a) => a.id === confirmedEntry.destinationAccountId);
    return saved ? externalAccountLabel(saved) : "—";
  })();
  const showPinNotSetHint = submitErrorCode === "PIN_NOT_SET";

  const applyMaxAmount = () => {
    if (available == null) return;
    entryForm.setFieldValue("amount", available);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      width={520}
      className={styles.modal}
      title={null}
      centered
      closable={false}
      maskClosable={!submitting}
    >
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.headerTitle}>
            {step === "entry" ? t("create.title") : t("create.confirm_title")}
          </h2>
          <p className={styles.headerSubtitle}>
            {step === "entry" ? t("create.subtitle") : t("create.confirm_subtitle")}
          </p>
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleCancel}
          aria-label={t("create.cancel")}
        >
          ×
        </button>
      </div>

      <div className={styles.body}>
        {submitError ? (
          <Alert
            type="error"
            showIcon
            message={submitError}
            className={styles.errorAlert}
            action={
              showPinNotSetHint ? (
                <Link href={pinSettingsPath} className={styles.setPinLink}>
                  {t("create.go_set_pin")}
                </Link>
              ) : undefined
            }
          />
        ) : null}

        {step === "entry" ? (
          <Form
            form={entryForm}
            layout="vertical"
            requiredMark={false}
            initialValues={{ assetCode, amount: "" }}
            className={styles.form}
            disabled={submitting}
          >
            <Form.Item
              name="assetCode"
              label={t("create.asset")}
              rules={[{ required: true, message: t("create.asset_required") }]}
            >
              <Select
                className={styles.assetSelect}
                options={selectOptions}
                disabled={assetLocked || selectOptions.length <= 1}
              />
            </Form.Item>

            <Form.Item
              name="amount"
              label={t("create.amount")}
              rules={[
                { required: true, message: t("create.amount_required") },
                {
                  pattern: /^\d+(\.\d+)?$/,
                  message: t("create.amount_invalid"),
                },
              ]}
            >
              <Input className={styles.fieldInput} placeholder="0.00" inputMode="decimal" />
            </Form.Item>

            {formattedAvailable ? (
              <div className={styles.availableRow}>
                <span className={styles.availableText}>
                  {t("create.available_hint", { available: formattedAvailable })}
                </span>
                <Button type="default" className={styles.maxBtn} onClick={applyMaxAmount} disabled={submitting}>
                  {t("create.max_amount")}
                </Button>
              </div>
            ) : null}

            {amountExceeds ? (
              <div className={styles.amountWarn}>{t("create.amount_exceeds_hint")}</div>
            ) : null}

            <Form.Item
              name="destinationAccountId"
              label={t("create.destination_account")}
              rules={[{ required: true, message: t("create.account_required") }]}
            >
              {accountsLoading ? (
                <div className={styles.loadingAccounts}>{t("create.loading_accounts")}</div>
              ) : hasAccounts ? (
                <Select
                  className={styles.accountSelect}
                  options={accountOptions}
                  value={selectedAccountId || undefined}
                  onChange={applyExternalAccount}
                  placeholder={t("create.account_required")}
                />
              ) : (
                <Alert
                  type="info"
                  showIcon
                  className={styles.noAccountsAlert}
                  message={t("create.no_accounts")}
                  action={
                    <Link href={externalAccountsPath} className={styles.setPinLink} onClick={onClose}>
                      {t("create.go_create_account")}
                    </Link>
                  }
                />
              )}
            </Form.Item>
          </Form>
        ) : confirmedEntry ? (
          <>
            <div className={styles.confirmReviewCard}>
              <span className={styles.confirmTotalLabel}>{t("create.apply_amount")}</span>
              <div className={`${styles.confirmTotalAmount} financial-amount`}>{formattedApplyAmount}</div>
              <div className={styles.confirmDivider} />
              <div className={styles.confirmDetails}>
                <div className={styles.confirmDetailRow}>
                  <span className={styles.confirmDetailLabel}>{t("create.asset")}</span>
                  <span className={styles.confirmDetailValue}>{confirmedEntry.assetCode}</span>
                </div>
                <div className={styles.confirmDetailRow}>
                  <span className={styles.confirmDetailLabel}>{t("create.destination_account")}</span>
                  <span className={styles.confirmDetailValue} title={confirmDestinationLabel}>
                    {confirmDestinationLabel}
                  </span>
                </div>
              </div>
              <p className={styles.summaryNote}>{t("create.fee_settlement_note")}</p>
            </div>

            <Form form={confirmForm} layout="vertical" className={styles.form} requiredMark={false}>
              <Form.Item
                label={
                  <div className={styles.pinLabelRow}>
                    <span className={styles.pinLabel}>
                      <Lock size={12} className={styles.pinLabelIcon} aria-hidden />
                      {t("create.payment_pin")}
                      <span style={{ color: "#f43f5e" }}> *</span>
                    </span>
                    <Link href={pinSettingsPath} className={styles.forgotPinLink}>
                      {t("create.forgot_pin")}
                    </Link>
                  </div>
                }
                required={false}
                name="paymentPin"
                rules={[
                  { required: true, message: t("create.validation.pinRequired") },
                  { pattern: /^\d{6}$/, message: t("create.validation.pinFormat") },
                ]}
              >
                <PaymentPinInput disabled={submitting} ariaLabel={t("create.payment_pin")} />
              </Form.Item>
            </Form>
          </>
        ) : null}
      </div>

      <div className={styles.footer}>
        {step === "entry" ? (
          <>
            <Button className={styles.cancelBtn} onClick={handleCancel} disabled={submitting}>
              {t("create.cancel")}
            </Button>
            <Button
              type="primary"
              className={styles.submitBtn}
              disabled={!canGoNext}
              onClick={() => void handleEntryNext()}
            >
              {t("create.next")}
            </Button>
          </>
        ) : (
          <>
            <Button
              className={styles.cancelBtn}
              disabled={submitting}
              onClick={() => {
                confirmForm.resetFields();
                setSubmitError(null);
                setSubmitErrorCode(null);
                setStep("entry");
              }}
            >
              {t("create.back")}
            </Button>
            <Button
              type="primary"
              className={styles.submitBtn}
              loading={submitting}
              disabled={submitting || (pinWatch?.length ?? 0) !== 6}
              icon={<Lock size={13} />}
              onClick={() => void handleConfirm()}
            >
              {t("create.submit")}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
