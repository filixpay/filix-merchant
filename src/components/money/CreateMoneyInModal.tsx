"use client";

import { useEffect, useRef, useState } from "react";
import { Alert, Button, Form, Input, Modal, Select } from "antd";
import { ArrowDownLeft, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError, moneyProductApi } from "@/lib/api";
import { ClientRequestIdAttempt } from "@/lib/money/client-request-id-attempt";
import { assertValidClientRequestId } from "@/lib/money/client-request-id";
import { resolveMoneyInCheckoutUrl } from "@/lib/money/money-in-checkout-redirect";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import MoneyAssetLabel from "@/components/money/MoneyAssetLabel";
import styles from "./CreateMoneyInModal.module.css";

export interface CreateMoneyInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string;
  /** @deprecated Deposit amount is not capped by available balance — kept for call-site compatibility. */
  available: string | null;
  assetCode: string;
  assetOptions?: string[];
  assetLocked?: boolean;
}

interface FormValues {
  assetCode: string;
  amount: string;
}

const QUICK_AMOUNTS = [100, 500, 1000, 5000] as const;

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

function renderAssetOption(code: string, accountLabel: string) {
  return <MoneyAssetLabel assetCode={code} accountLabel={accountLabel} />;
}

export default function CreateMoneyInModal({
  open,
  onClose,
  onSuccess,
  accessToken,
  assetCode,
  assetOptions,
  assetLocked = false,
}: CreateMoneyInModalProps) {
  const t = useTranslations("MoneyIn");
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const attemptRef = useRef<ClientRequestIdAttempt | null>(null);

  const catalog = assetOptions?.length ? assetOptions : ["CNY", "USD", "EUR", "HKD", "JPY", "GBP"];
  const selectOptions = catalog.map((code) => ({
    value: code,
    label: code,
  }));

  const assetWatch = Form.useWatch("assetCode", form) ?? assetCode;

  useEffect(() => {
    if (open) {
      attemptRef.current = new ClientRequestIdAttempt();
      form.setFieldsValue({ assetCode, amount: "" });
      setSubmitError(null);
    }
  }, [open, assetCode, form]);

  const handleSubmit = async (values: FormValues) => {
    const attempt = attemptRef.current ?? new ClientRequestIdAttempt();
    attemptRef.current = attempt;
    const clientRequestId = assertValidClientRequestId(attempt.current());

    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await moneyProductApi.createMoneyIn(
        {
          assetCode: values.assetCode,
          amount: values.amount.trim(),
          clientRequestId,
        },
        accessToken,
      );
      const checkoutUrl = resolveMoneyInCheckoutUrl(created.nextAction);
      if (checkoutUrl) {
        onSuccess();
        onClose();
        window.location.href = checkoutUrl;
        return;
      }
      const detail =
        created.failureReason?.trim() ||
        `status=${created.status ?? "unknown"}; fundingSessionId=${created.fundingSessionId ?? "null"}; nextAction=${created.nextAction ? created.nextAction.type : "null"}`;
      try {
        setSubmitError(t("create.checkout_unavailable", { detail }));
      } catch {
        setSubmitError(`Checkout unavailable. ${detail}`);
      }
      onSuccess();
    } catch (err) {
      setSubmitError(resolveErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!submitting) {
      onClose();
    }
  };

  const applyQuickAmount = (value: number) => {
    form.setFieldValue("amount", String(value));
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
          <div className={styles.headerIcon} aria-hidden>
            <ArrowDownLeft size={18} strokeWidth={2} />
          </div>
          <div>
            <h3 className={styles.headerTitle}>{t("create.title")}</h3>
            <p className={styles.headerSubtitle}>{t("create.subtitle")}</p>
          </div>
        </div>
        <button type="button" className={styles.closeBtn} onClick={handleCancel} aria-label={t("create.cancel")}>
          ×
        </button>
      </div>

      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        initialValues={{ assetCode, amount: "" }}
        onFinish={(values) => void handleSubmit(values)}
      >
        <Form.Item
          name="assetCode"
          label={t("create.asset")}
          rules={[{ required: true, message: t("create.asset_required") }]}
        >
          <Select
            options={selectOptions}
            disabled={assetLocked || selectOptions.length <= 1}
            open={assetLocked || selectOptions.length <= 1 ? false : undefined}
            suffixIcon={assetLocked || selectOptions.length <= 1 ? null : undefined}
            className={styles.assetSelect}
            optionRender={(option) =>
              renderAssetOption(
                String(option.value ?? ""),
                t("create.asset_account", { asset: String(option.value ?? "") }),
              )
            }
            labelRender={(props) =>
              renderAssetOption(
                String(props.value ?? assetWatch),
                t("create.asset_account", { asset: String(props.value ?? assetWatch) }),
              )
            }
          />
        </Form.Item>

        <Form.Item label={t("create.amount")} required>
          <div className={styles.amountField}>
            <Form.Item
              name="amount"
              noStyle
              rules={[
                { required: true, message: t("create.amount_required") },
                {
                  pattern: /^\d+(\.\d+)?$/,
                  message: t("create.amount_invalid"),
                },
              ]}
            >
              <Input
                placeholder="0.00"
                inputMode="decimal"
                className={`${styles.amountInput} financial-amount`}
              />
            </Form.Item>
            <span className={styles.amountCode} aria-hidden>
              {assetWatch}
            </span>
          </div>
        </Form.Item>

        <p className={styles.settlementHint}>
          <Info size={12} strokeWidth={1.75} aria-hidden />
          <span>{t("create.settlement_hint")}</span>
        </p>

        <div className={styles.quickAmounts}>
          <span className={styles.quickAmountsLabel}>{t("create.quick_amounts_label")}</span>
          <div className={styles.quickAmountsGroup}>
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                className={styles.quickAmountBtn}
                onClick={() => applyQuickAmount(value)}
              >
                +{value}
              </button>
            ))}
          </div>
        </div>

        {submitError ? <Alert type="error" showIcon message={submitError} className={styles.errorAlert} /> : null}

        <div className={styles.footer}>
          <Button onClick={handleCancel} disabled={submitting} className={styles.cancelBtn}>
            {t("create.cancel")}
          </Button>
          <Button type="primary" loading={submitting} onClick={() => form.submit()} className={styles.submitBtn}>
            {t("create.submit")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
