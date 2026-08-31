"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Alert, Form, Input, Modal, Select, Tooltip, Typography } from "antd";
import { EyeInvisibleOutlined, EyeOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { ApiError, moneyProductApi, type ExternalAccountCreateRequest } from "@/lib/api";
import { presentMoneyProductError } from "@/lib/money/product-error-presenter";
import AssetFlagIcon from "@/components/money/AssetFlagIcon";
import {
  CRYPTO_EXTERNAL_ACCOUNT_NETWORKS,
  EXTERNAL_ACCOUNT_COUNTRIES,
  EXTERNAL_ACCOUNT_CURRENCIES,
  formatAccountNumberForDisplay,
  looksLikeEmailAccountHolder,
  stripAccountNumberSpaces,
  type ExternalAccountTypeChoice,
} from "./external-account-form-model";
import styles from "./CreateExternalAccountModal.module.css";

export interface CreateExternalAccountModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string;
  /** Prefill currency when opened from payout flow. */
  defaultCurrency?: string;
}

interface FormValues {
  type: ExternalAccountTypeChoice;
  country: string;
  currency: string;
  accountHolderName: string;
  accountNumber: string;
  bankName?: string;
  bankCode?: string;
  network: string;
  cryptoAddress: string;
  memoTag?: string;
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
}

export default function CreateExternalAccountModal({
  open,
  onClose,
  onSuccess,
  accessToken,
  defaultCurrency = "CNY",
}: CreateExternalAccountModalProps) {
  const t = useTranslations("MoneyExternalAccounts");
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccountNumber, setShowAccountNumber] = useState(true);
  const accountType = Form.useWatch("type", form) ?? "BANK";

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue({
      type: "BANK",
      country: "CN",
      currency: defaultCurrency,
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      bankCode: "",
      network: "TRON",
      cryptoAddress: "",
      memoTag: "",
    });
    setShowAccountNumber(true);
    setError(null);
  }, [open, defaultCurrency, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const body: ExternalAccountCreateRequest =
        values.type === "CRYPTO"
          ? {
              type: "CRYPTO",
              network: values.network.trim().toUpperCase(),
              cryptoAddress: values.cryptoAddress.trim(),
              memoTag: values.memoTag?.trim() || null,
            }
          : {
              type: "BANK",
              country: values.country.trim().toUpperCase(),
              currency: values.currency.trim().toUpperCase(),
              accountHolderName: values.accountHolderName.trim(),
              accountNumber: stripAccountNumberSpaces(values.accountNumber),
              bankName: values.bankName?.trim() || null,
              bankCode: values.bankCode?.trim().toUpperCase() || null,
            };
      setSubmitting(true);
      setError(null);
      await moneyProductApi.createExternalAccount(body, accessToken);
      form.setFieldValue("accountNumber", "");
      form.setFieldValue("cryptoAddress", "");
      onSuccess();
      onClose();
    } catch (err) {
      if (err && typeof err === "object" && "errorFields" in err) return;
      setError(resolveErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const countryOptions = EXTERNAL_ACCOUNT_COUNTRIES.map((item) => ({
    value: item.value,
    label: t(item.labelKey),
  }));

  const currencyOptions = EXTERNAL_ACCOUNT_CURRENCIES.map((code) => ({
    value: code,
    label: (
      <span className={styles.currencyOption}>
        <AssetFlagIcon assetCode={code} size={16} />
        <span>{code}</span>
      </span>
    ),
  }));

  const networkOptions = CRYPTO_EXTERNAL_ACCOUNT_NETWORKS.map((network) => ({
    value: network,
    label: network,
  }));

  return (
    <Modal
      open={open}
      onCancel={() => (!submitting ? onClose() : undefined)}
      title={t("create.title")}
      okText={t("create.submit")}
      cancelText={t("create.cancel")}
      onOk={() => void handleSubmit()}
      confirmLoading={submitting}
      destroyOnHidden
      width={520}
    >
      {error ? <Alert type="error" showIcon message={error} style={{ marginBottom: 12 }} /> : null}
      <Form form={form} layout="vertical" disabled={submitting} requiredMark>
        <Form.Item
          name="type"
          label={t("create.type")}
          rules={[{ required: true, message: t("create.type_required") }]}
        >
          <Select
            options={[
              { value: "BANK", label: t("create.type_bank") },
              { value: "CRYPTO", label: t("create.type_crypto") },
            ]}
          />
        </Form.Item>

        {accountType === "CRYPTO" ? (
          <>
            <Form.Item
              name="network"
              label={t("create.network")}
              rules={[{ required: true, message: t("create.network_required") }]}
            >
              <Select options={networkOptions} />
            </Form.Item>
            <Form.Item
              name="cryptoAddress"
              label={t("create.crypto_address")}
              rules={[
                { required: true, message: t("create.crypto_address_required") },
                {
                  validator: (_, value: string | undefined) => {
                    const compact = (value ?? "").trim();
                    if (!compact) return Promise.resolve();
                    if (compact.length < 20) {
                      return Promise.reject(new Error(t("create.crypto_address_too_short")));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder={t("create.crypto_address_placeholder")}
                autoComplete="off"
                spellCheck={false}
              />
            </Form.Item>
            <Form.Item name="memoTag" label={t("create.memo_tag")}>
              <Input placeholder={t("create.memo_tag_placeholder")} autoComplete="off" />
            </Form.Item>
          </>
        ) : (
          <>
            <div className={styles.row2}>
              <Form.Item
                name="country"
                label={t("create.country")}
                rules={[{ required: true, message: t("create.country_required") }]}
              >
                <Select options={countryOptions} showSearch optionFilterProp="label" />
              </Form.Item>
              <Form.Item
                name="currency"
                label={t("create.currency")}
                rules={[{ required: true, message: t("create.currency_required") }]}
              >
                <Select options={currencyOptions} />
              </Form.Item>
            </div>

            <Form.Item
              name="accountHolderName"
              label={
                <span className={styles.labelRow}>
                  <span>{t("create.holder")}</span>
                  <span className={styles.hint}>{t("create.holder_hint")}</span>
                </span>
              }
              rules={[
                { required: true, message: t("create.holder_required") },
                {
                  validator: (_, value: string | undefined) => {
                    if (value && looksLikeEmailAccountHolder(value)) {
                      return Promise.reject(new Error(t("create.holder_not_email")));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder={t("create.holder_placeholder")} autoComplete="organization" />
            </Form.Item>

            <Form.Item
              name="accountNumber"
              label={
                <span className={styles.labelRow}>
                  <span>{t("create.account_number")}</span>
                  <span className={styles.hint}>{t("create.account_number_hint")}</span>
                </span>
              }
              rules={[
                { required: true, message: t("create.account_number_required") },
                {
                  validator: (_, value: string | undefined) => {
                    const compact = stripAccountNumberSpaces(value ?? "");
                    if (!compact) return Promise.resolve();
                    if (compact.length < 6) {
                      return Promise.reject(new Error(t("create.account_number_too_short")));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              getValueFromEvent={(event: ChangeEvent<HTMLInputElement>) =>
                formatAccountNumberForDisplay(event.target.value)
              }
            >
              <Input
                className={styles.accountInput}
                type={showAccountNumber ? "text" : "password"}
                placeholder={t("create.account_number_placeholder")}
                autoComplete="off"
                spellCheck={false}
                suffix={
                  <Typography.Link
                    onClick={(event) => {
                      event.preventDefault();
                      setShowAccountNumber((prev) => !prev);
                    }}
                    aria-label={
                      showAccountNumber
                        ? t("create.hide_account_number")
                        : t("create.show_account_number")
                    }
                  >
                    {showAccountNumber ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </Typography.Link>
                }
              />
            </Form.Item>

            <div className={styles.row2}>
              <Form.Item name="bankName" label={t("create.bank_name")}>
                <Input placeholder={t("create.bank_name_placeholder")} autoComplete="off" />
              </Form.Item>
              <Form.Item
                name="bankCode"
                label={
                  <span className={styles.labelRow}>
                    <span>{t("create.bank_code")}</span>
                    <Tooltip title={t("create.bank_code_help")}>
                      <QuestionCircleOutlined style={{ color: "#94a3b8" }} />
                    </Tooltip>
                  </span>
                }
                getValueFromEvent={(event: ChangeEvent<HTMLInputElement>) =>
                  event.target.value.toUpperCase()
                }
              >
                <Input
                  className={styles.bankCodeInput}
                  placeholder={t("create.bank_code_placeholder")}
                  autoComplete="off"
                  spellCheck={false}
                />
              </Form.Item>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
}
