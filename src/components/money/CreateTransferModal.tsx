"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Form, Input, Modal, Select, message } from "antd";
import { AlertCircle, ArrowRight, Building2, CheckCircle2, Loader2, Lock, Send, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ApiError, merchantsApi, moneyProductApi } from "@/lib/api";
import { shouldWarnAmountExceedsAvailable } from "@/lib/money/amount-hint";
import { formatWalletAmountDisplay } from "@/lib/money/asset-display";
import { ClientRequestIdAttempt } from "@/lib/money/client-request-id-attempt";
import { assertValidClientRequestId } from "@/lib/money/client-request-id";
import { moneyTransfersDetailPath } from "@/lib/money/money-transfers-redirect";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import MoneyAssetLabel from "@/components/money/MoneyAssetLabel";
import PaymentPinInput from "@/components/money/PaymentPinInput";
import styles from "./CreateTransferModal.module.css";

export interface CreateTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string;
  /** Available balance decimal string for UX hint only — not mutated. */
  available: string | null;
  assetCode: string;
  assetOptions?: string[];
  assetLocked?: boolean;
}

type Step = "entry" | "confirm";

interface EntryFormValues {
  assetCode: string;
  amount: string;
  targetMerchantCode: string;
}

interface ConfirmFormValues {
  paymentPin: string;
}

type PayeeLookupState = "idle" | "loading" | "ok" | "error";

const PAYEE_LOOKUP_MIN_LENGTH = 10;

function resolveErrorMessage(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError) {
    const code = String(error.code ?? "").trim();
    if (code === "PIN_NOT_SET") {
      return error.message || t("errors.pinNotSet");
    }
    if (code === "INCORRECT_PIN" || code === "MAX_ATTEMPTS_EXCEEDED") {
      return error.message || t("errors.pinIncorrect");
    }
    if (code === "PAYMENT_PIN_REQUIRED") {
      return t("validation.pinRequired");
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

function parsePositiveAmount(amount: string): number | null {
  const raw = amount?.trim() ?? "";
  if (!/^\d+(\.\d+)?$/.test(raw)) {
    return null;
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return value;
}

function renderAssetOption(code: string, accountLabel: string) {
  return <MoneyAssetLabel assetCode={code} accountLabel={accountLabel} />;
}

function computeRemainingBalance(available: string, amount: string): string | null {
  const availableRaw = available.trim();
  const amountRaw = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(availableRaw) || !/^\d+(\.\d+)?$/.test(amountRaw)) {
    return null;
  }
  const remaining = Number(availableRaw) - Number(amountRaw);
  if (!Number.isFinite(remaining)) {
    return null;
  }
  const fraction = Math.max(
    availableRaw.includes(".") ? (availableRaw.split(".")[1]?.length ?? 2) : 2,
    amountRaw.includes(".") ? (amountRaw.split(".")[1]?.length ?? 2) : 2,
  );
  return Math.max(remaining, 0).toFixed(fraction);
}

/**
 * Money Transfer create — two-step confirm + payment pin (TP-DEC-002/003).
 * TR-DEC-016: no dedicated CLEARED continue CTA; navigate to detail with truthful status.
 */
export default function CreateTransferModal({
  open,
  onClose,
  onSuccess,
  accessToken,
  available,
  assetCode,
  assetOptions,
  assetLocked = false,
}: CreateTransferModalProps) {
  const t = useTranslations("MoneyTransfers");
  const locale = useLocale();
  const router = useRouter();
  const [entryForm] = Form.useForm<EntryFormValues>();
  const [confirmForm] = Form.useForm<ConfirmFormValues>();
  const [step, setStep] = useState<Step>("entry");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitErrorCode, setSubmitErrorCode] = useState<string | null>(null);
  const [payeeName, setPayeeName] = useState<string | null>(null);
  const [payeeAlias, setPayeeAlias] = useState<string | null>(null);
  const [payeeLookup, setPayeeLookup] = useState<PayeeLookupState>("idle");
  const [payeeLookupError, setPayeeLookupError] = useState<string | null>(null);
  const [confirmedEntry, setConfirmedEntry] = useState<EntryFormValues | null>(null);
  const lastLookedUpCodeRef = useRef<string | null>(null);

  const amountWatch = Form.useWatch("amount", entryForm);
  const pinWatch = Form.useWatch("paymentPin", confirmForm);
  const assetWatch = Form.useWatch("assetCode", entryForm) ?? assetCode;
  const merchantCodeWatch = Form.useWatch("targetMerchantCode", entryForm) ?? "";

  const catalog = assetOptions?.length ? assetOptions : ["CNY", "USD", "EUR", "HKD", "JPY", "GBP"];
  const selectOptions = catalog.map((code) => ({ value: code, label: code }));

  const availableDisplay = useMemo(() => {
    if (!available?.trim()) {
      return null;
    }
    return formatWalletAmountDisplay(available, assetWatch, locale);
  }, [available, assetWatch, locale]);

  const resetModal = useCallback(() => {
    setStep("entry");
    setSubmitting(false);
    setSubmitError(null);
    setSubmitErrorCode(null);
    setPayeeName(null);
    setPayeeAlias(null);
    setPayeeLookup("idle");
    setPayeeLookupError(null);
    setConfirmedEntry(null);
    lastLookedUpCodeRef.current = null;
    entryForm.resetFields();
    confirmForm.resetFields();
  }, [confirmForm, entryForm]);

  useEffect(() => {
    if (open) {
      resetModal();
      entryForm.setFieldsValue({
        assetCode,
        amount: "",
        targetMerchantCode: "",
      });
    }
  }, [open, assetCode, entryForm, resetModal]);

  const lookupPayee = useCallback(
    async (code: string): Promise<boolean> => {
      const trimmed = code.trim();
      if (!trimmed) {
        setPayeeName(null);
        setPayeeAlias(null);
        setPayeeLookup("idle");
        setPayeeLookupError(null);
        lastLookedUpCodeRef.current = null;
        return false;
      }
      if (lastLookedUpCodeRef.current === trimmed) {
        return payeeLookup === "ok";
      }
      setPayeeLookup("loading");
      setPayeeLookupError(null);
      try {
        const result = await merchantsApi.lookupByCode(trimmed, accessToken);
        setPayeeName(result?.name ?? null);
        setPayeeAlias(result?.alias?.trim() || null);
        setPayeeLookup("ok");
        lastLookedUpCodeRef.current = trimmed;
        return true;
      } catch (error) {
        setPayeeName(null);
        setPayeeAlias(null);
        setPayeeLookup("error");
        lastLookedUpCodeRef.current = trimmed;
        if (error instanceof ApiError) {
          setPayeeLookupError(error.message || t("validation.payeeLookupFailed"));
        } else {
          setPayeeLookupError(t("validation.payeeLookupFailed"));
        }
        return false;
      }
    },
    [accessToken, payeeLookup, t],
  );

  useEffect(() => {
    if (step !== "entry") {
      return;
    }
    const trimmed = merchantCodeWatch.trim();
    if (!trimmed) {
      setPayeeName(null);
      setPayeeAlias(null);
      setPayeeLookup("idle");
      setPayeeLookupError(null);
      lastLookedUpCodeRef.current = null;
      return;
    }
    if (trimmed.length < PAYEE_LOOKUP_MIN_LENGTH) {
      setPayeeName(null);
      setPayeeAlias(null);
      setPayeeLookup("idle");
      setPayeeLookupError(null);
      lastLookedUpCodeRef.current = null;
      return;
    }
    const timer = window.setTimeout(() => {
      void lookupPayee(trimmed);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [merchantCodeWatch, step, lookupPayee]);

  const warnOverAvailable = shouldWarnAmountExceedsAvailable(amountWatch ?? "", available ?? "");
  const trimmedMerchantCode = merchantCodeWatch.trim();
  const showPayeeCard = trimmedMerchantCode.length >= PAYEE_LOOKUP_MIN_LENGTH;
  const canProceed =
    parsePositiveAmount(amountWatch ?? "") !== null &&
    !warnOverAvailable &&
    payeeLookup === "ok" &&
    Boolean(payeeName);

  const handleNext = async () => {
    try {
      const values = await entryForm.validateFields();
      const ok = await lookupPayee(values.targetMerchantCode);
      if (!ok) {
        return;
      }
      setConfirmedEntry({
        assetCode: values.assetCode,
        amount: values.amount.trim(),
        targetMerchantCode: values.targetMerchantCode.trim(),
      });
      setSubmitError(null);
      setSubmitErrorCode(null);
      confirmForm.resetFields();
      setStep("confirm");
    } catch {
      // validation errors shown by Form
    }
  };

  const handleConfirm = async () => {
    if (!confirmedEntry) {
      return;
    }
    try {
      const pinValues = await confirmForm.validateFields();
      if (!/^\d{6}$/.test(pinValues.paymentPin)) {
        return;
      }
      const clientRequestId = assertValidClientRequestId(new ClientRequestIdAttempt().current());
      setSubmitting(true);
      setSubmitError(null);
      setSubmitErrorCode(null);
      const view = await moneyProductApi.createTransfer(
        {
          assetCode: confirmedEntry.assetCode,
          amount: confirmedEntry.amount,
          clientRequestId,
          targetMerchantCode: confirmedEntry.targetMerchantCode,
          paymentPin: pinValues.paymentPin,
        },
        accessToken,
      );
      onSuccess();
      onClose();
      message.success(t("createSuccess"));
      if (view.transferId) {
        router.push(moneyTransfersDetailPath(locale, view.transferId));
      }
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        return;
      }
      setSubmitError(resolveErrorMessage(error, t));
      if (error instanceof ApiError) {
        setSubmitErrorCode(String(error.code ?? ""));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const applyMaxAmount = () => {
    const raw = available?.trim();
    if (!raw) {
      return;
    }
    entryForm.setFieldValue("amount", raw);
  };

  const handleCancel = () => {
    if (!submitting) {
      onClose();
    }
  };

  const showPinNotSetHint = submitErrorCode === "PIN_NOT_SET";
  const pinSettingsPath = `/${locale}/dashboard/security-settings/transaction-password`;

  const confirmAmountDisplay = confirmedEntry
    ? formatWalletAmountDisplay(confirmedEntry.amount, confirmedEntry.assetCode, locale)
    : null;

  const remainingBalanceRaw =
    confirmedEntry && available
      ? computeRemainingBalance(available, confirmedEntry.amount)
      : null;

  const remainingBalanceDisplay =
    remainingBalanceRaw && confirmedEntry
      ? formatWalletAmountDisplay(remainingBalanceRaw, confirmedEntry.assetCode, locale)
      : null;

  const payeeDisplayName = payeeName ?? payeeAlias;

  const payeeStatusText = payeeAlias
    ? t("payeeVerifiedWithAlias", { alias: payeeAlias })
    : t("payeeVerified");

  const renderPayeeCard = () => {
    if (!showPayeeCard) {
      return null;
    }
    if (payeeLookup === "loading") {
      return (
        <div className={`${styles.payeeCard} ${styles.payeeCardLoading}`}>
          <div className={`${styles.payeeCardIcon} ${styles.payeeCardIconLoading}`}>
            <Loader2 size={14} className={styles.spin} aria-hidden />
          </div>
          <div className={styles.payeeCardContent}>
            <span className={styles.payeeCardName}>{t("lookupLoading")}</span>
            <span className={`${styles.payeeCardMeta} ${styles.payeeCardMetaLoading}`}>
              {t("payeeLookupHint")}
            </span>
          </div>
        </div>
      );
    }
    if (payeeLookup === "error") {
      return (
        <div className={`${styles.payeeCard} ${styles.payeeCardError}`}>
          <div className={`${styles.payeeCardIcon} ${styles.payeeCardIconError}`}>
            <AlertCircle size={14} aria-hidden />
          </div>
          <div className={styles.payeeCardContent}>
            <span className={styles.payeeCardName}>{t("payeeNotFoundTitle")}</span>
            <span className={`${styles.payeeCardMeta} ${styles.payeeCardMetaError}`}>
              {payeeLookupError ?? t("validation.payeeLookupFailed")}
            </span>
          </div>
        </div>
      );
    }
    if (payeeLookup === "ok" && payeeName) {
      return (
        <div className={`${styles.payeeCard} ${styles.payeeCardSuccess}`}>
          <div className={`${styles.payeeCardIcon} ${styles.payeeCardIconSuccess}`}>
            <Building2 size={14} aria-hidden />
          </div>
          <div className={styles.payeeCardContent}>
            <span className={styles.payeeCardName}>{payeeName}</span>
            <span className={`${styles.payeeCardMeta} ${styles.payeeCardMetaSuccess}`}>
              {payeeStatusText}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={440}
      centered
      destroyOnHidden
      className={styles.modal}
      title={null}
      closable={false}
    >
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <div
            className={`${styles.headerIcon}${step === "confirm" ? ` ${styles.headerIconConfirm}` : ""}`}
            aria-hidden
          >
            {step === "confirm" ? <ShieldCheck size={16} strokeWidth={2} /> : <Send size={16} strokeWidth={2} />}
          </div>
          <div>
            <h3 className={styles.headerTitle}>
              {step === "entry" ? t("createTitle") : t("confirmTitle")}
            </h3>
            <p className={styles.headerSubtitle}>
              {step === "entry" ? t("createSubtitle") : t("confirmSubtitle")}
            </p>
          </div>
        </div>
        <button type="button" className={styles.closeBtn} onClick={handleCancel} aria-label={t("cancel")}>
          ×
        </button>
      </div>

      <div className={styles.body}>
        {submitError ? (
          <Alert type="error" showIcon message={submitError} className={styles.errorAlert} />
        ) : null}
        {showPinNotSetHint ? (
          <Alert
            type="info"
            showIcon
            className={styles.errorAlert}
            message={
              <Link href={pinSettingsPath} style={{ fontWeight: 500 }}>
                {t("goSetPin")}
              </Link>
            }
          />
        ) : null}

        {step === "entry" ? (
          <Form form={entryForm} layout="vertical" className={styles.form}>
            <Form.Item
              name="assetCode"
              label={t("fields.asset")}
              rules={[{ required: true, message: t("validation.assetRequired") }]}
            >
              <Select
                options={selectOptions}
                disabled={assetLocked || submitting || selectOptions.length <= 1}
                open={assetLocked || selectOptions.length <= 1 ? false : undefined}
                suffixIcon={assetLocked || selectOptions.length <= 1 ? null : undefined}
                className={styles.assetSelect}
                optionRender={(option) =>
                  renderAssetOption(
                    String(option.value ?? ""),
                    t("assetAccount", { asset: String(option.value ?? "") }),
                  )
                }
                labelRender={(props) =>
                  renderAssetOption(
                    String(props.value ?? assetWatch),
                    t("assetAccount", { asset: String(props.value ?? assetWatch) }),
                  )
                }
              />
            </Form.Item>

            <Form.Item
              label={
                <div className={styles.amountLabelRow}>
                  <span>{t("fields.amount")}</span>
                  {availableDisplay ? (
                    <div className={styles.availableRow}>
                      <span>{t("availableShort")}:</span>
                      <span className={`${styles.availableValue} financial-amount`}>
                        {availableDisplay.symbol}
                        {availableDisplay.amount}
                      </span>
                      <button
                        type="button"
                        className={styles.maxBtn}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          applyMaxAmount();
                        }}
                      >
                        {t("useMaxAmount")}
                      </button>
                    </div>
                  ) : null}
                </div>
              }
              required
            >
              <div className={styles.amountField}>
                <Form.Item
                  name="amount"
                  noStyle
                  rules={[
                    { required: true, message: t("validation.amountRequired") },
                    {
                      pattern: /^\d+(\.\d+)?$/,
                      message: t("validation.amountInvalid"),
                    },
                  ]}
                >
                  <Input
                    placeholder="0.00"
                    inputMode="decimal"
                    disabled={submitting}
                    className={`${styles.amountInput} financial-amount ${warnOverAvailable ? styles.amountInputWarning : ""}`}
                  />
                </Form.Item>
                <span className={styles.amountCode} aria-hidden>
                  {assetWatch}
                </span>
              </div>
            </Form.Item>
            {warnOverAvailable ? (
              <p className={styles.amountWarning}>{t("amountExceedsAvailableHint")}</p>
            ) : null}

            <Form.Item
              name="targetMerchantCode"
              label={t("fields.targetMerchantCode")}
              rules={[{ required: true, message: t("validation.targetRequired") }]}
            >
              <Input
                placeholder={t("targetMerchantPlaceholder")}
                disabled={submitting}
                className={styles.merchantInput}
              />
            </Form.Item>
            {renderPayeeCard()}

            <div className={styles.footer}>
              <Button onClick={handleCancel} disabled={submitting} className={styles.cancelBtn}>
                {t("cancel")}
              </Button>
              <Button
                type="primary"
                loading={payeeLookup === "loading"}
                disabled={!canProceed || submitting}
                onClick={() => void handleNext()}
                className={styles.primaryBtn}
              >
                {t("next")}
              </Button>
            </div>
          </Form>
        ) : confirmedEntry ? (
          <>
            <div className={styles.confirmReviewCard}>
              <span className={styles.confirmTotalLabel}>{t("confirmTotalLabel")}</span>
              <div className={`${styles.confirmTotalAmount} financial-amount`}>
                {confirmAmountDisplay?.symbol}
                {confirmAmountDisplay?.amount}
                <span className={styles.confirmTotalAsset}>{confirmedEntry.assetCode}</span>
              </div>

              <div className={styles.flowRow}>
                <div className={styles.flowParty}>
                  <div className={`${styles.flowPartyIcon} ${styles.flowPartyIconFrom}`}>
                    <Wallet size={14} aria-hidden />
                  </div>
                  <span className={styles.flowPartyLabel}>{t("confirmFromLabel")}</span>
                  <span className={styles.flowPartyName}>
                    {t("assetAccount", { asset: confirmedEntry.assetCode })}
                  </span>
                </div>
                <ArrowRight size={16} className={styles.flowArrow} aria-hidden />
                <div className={styles.flowParty}>
                  <div className={`${styles.flowPartyIcon} ${styles.flowPartyIconTo}`}>
                    <Building2 size={14} aria-hidden />
                  </div>
                  <span className={styles.flowPartyLabel}>{t("confirmToLabel")}</span>
                  <span className={styles.flowPartyName}>{payeeDisplayName ?? "—"}</span>
                </div>
              </div>

              <div className={styles.confirmDivider} />

              <div className={styles.confirmDetails}>
                {payeeDisplayName ? (
                  <div className={styles.confirmDetailRow}>
                    <span className={styles.confirmDetailLabel}>{t("confirmPayeeMerchant")}</span>
                    <span className={`${styles.confirmDetailValue} ${styles.confirmDetailValueVerified}`}>
                      {payeeDisplayName}
                      <CheckCircle2 size={13} className={styles.confirmVerifiedIcon} aria-hidden />
                    </span>
                  </div>
                ) : null}
                {payeeAlias && payeeAlias !== payeeName ? (
                  <div className={styles.confirmDetailRow}>
                    <span className={styles.confirmDetailLabel}>{t("fields.payeeAlias")}</span>
                    <span className={styles.confirmDetailValue}>{payeeAlias}</span>
                  </div>
                ) : null}
                <div className={styles.confirmDetailRow}>
                  <span className={styles.confirmDetailLabel}>{t("fields.targetMerchantCode")}</span>
                  <span className={`${styles.confirmDetailValue} ${styles.confirmDetailValueMono}`}>
                    {confirmedEntry.targetMerchantCode}
                  </span>
                </div>
                {remainingBalanceDisplay ? (
                  <div className={styles.confirmDetailRow}>
                    <span className={styles.confirmDetailLabel}>{t("confirmRemainingBalance")}</span>
                    <span className={`${styles.confirmDetailValue} financial-amount`}>
                      {remainingBalanceDisplay.symbol}
                      {remainingBalanceDisplay.amount} {confirmedEntry.assetCode}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <Form form={confirmForm} layout="vertical" className={styles.form}>
              <Form.Item
                label={
                  <div className={styles.pinLabelRow}>
                    <span className={styles.pinLabel}>
                      <Lock size={12} className={styles.pinLabelIcon} aria-hidden />
                      {t("fields.paymentPin")}
                      <span style={{ color: "#f43f5e" }}> *</span>
                    </span>
                    <Link href={pinSettingsPath} className={styles.forgotPinLink}>
                      {t("forgotPin")}
                    </Link>
                  </div>
                }
                required={false}
                name="paymentPin"
                rules={[
                  { required: true, message: t("validation.pinRequired") },
                  { pattern: /^\d{6}$/, message: t("validation.pinFormat") },
                ]}
              >
                <PaymentPinInput disabled={submitting} ariaLabel={t("fields.paymentPin")} />
              </Form.Item>

              <div className={styles.footer}>
                <Button
                  disabled={submitting}
                  onClick={() => {
                    confirmForm.resetFields();
                    setStep("entry");
                  }}
                  className={styles.cancelBtn}
                >
                  {t("back")}
                </Button>
                <Button
                  type="primary"
                  loading={submitting}
                  disabled={submitting || (pinWatch?.length ?? 0) !== 6}
                  icon={<Lock size={13} />}
                  onClick={() => void handleConfirm()}
                  className={`${styles.primaryBtn} ${styles.confirmPrimaryBtn}`}
                >
                  {t("confirmTransfer")}
                </Button>
              </div>
            </Form>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
