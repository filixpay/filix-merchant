"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button, Checkbox, Drawer, Form, Input, Select, message } from "antd";
import { useTranslations } from "next-intl";
import {
  api,
  ApiError,
  CryptoDepositWalletCreateRequest,
  CryptoDepositWalletUpdateRequest,
  CryptoDepositWalletView,
  CryptoSupportedAsset,
} from "@/lib/api";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import {
  getAddressFormatHint,
  getAddressValidationState,
  validateDepositAddress,
  walletAssetKey,
} from "./deposit-wallet-model";
import styles from "./DepositWalletFormDrawer.module.css";

type FormValues = {
  chainCode: string;
  assetCode: string;
  network?: string;
  depositAddress: string;
  label?: string;
};

interface DepositWalletFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string;
  supportedAssets: CryptoSupportedAsset[];
  existingWallets: CryptoDepositWalletView[];
  editingWallet: CryptoDepositWalletView | null;
}

const KNOWN_ERROR_CODES = ["PLATFORM_MANAGED", "ACTIVE_RESERVATIONS", "INVALID_ADDRESS", "WALLET_EXISTS"];

export default function DepositWalletFormDrawer({
  isOpen,
  onClose,
  onSuccess,
  accessToken,
  supportedAssets,
  existingWallets,
  editingWallet,
}: DepositWalletFormDrawerProps) {
  const t = useTranslations("CryptoDepositWallets.form");
  const tErrors = useTranslations("CryptoDepositWallets.errors");
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const isEditing = editingWallet !== null;
  const chainCode = Form.useWatch("chainCode", form);
  const assetCode = Form.useWatch("assetCode", form);
  const depositAddress = Form.useWatch("depositAddress", form) ?? "";

  const addressState = getAddressValidationState(chainCode, depositAddress);
  const formatHint = getAddressFormatHint(chainCode);

  const existingKeys = useMemo(
    () =>
      new Set(
        existingWallets
          .filter((wallet) => !isEditing || wallet.id !== editingWallet?.id)
          .map((wallet) => walletAssetKey(wallet.chainCode, wallet.assetCode, wallet.network)),
      ),
    [existingWallets, editingWallet, isEditing],
  );

  const chainOptions = useMemo(() => {
    const chains = new Map<string, string>();
    for (const asset of supportedAssets) {
      chains.set(asset.chainCode, asset.chainName ?? asset.chainCode);
    }
    return [...chains.entries()].map(([value, label]) => ({ value, label }));
  }, [supportedAssets]);

  const assetOptions = useMemo(() => {
    if (!chainCode) return [];
    return supportedAssets
      .filter((asset) => asset.chainCode === chainCode)
      .map((asset) => {
        const key = walletAssetKey(asset.chainCode, asset.assetCode, asset.network);
        return {
          value: asset.assetCode,
          label: asset.assetName ?? asset.assetCode,
          network: asset.network,
          disabled: !isEditing && existingKeys.has(key),
        };
      });
  }, [supportedAssets, chainCode, existingKeys, isEditing]);

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setConfirmed(false);
      return;
    }

    if (editingWallet) {
      form.setFieldsValue({
        chainCode: editingWallet.chainCode,
        assetCode: editingWallet.assetCode,
        network: editingWallet.network,
        depositAddress: editingWallet.depositAddress,
        label: editingWallet.label,
      });
    } else {
      form.resetFields();
    }
    setConfirmed(false);
  }, [isOpen, editingWallet, form]);

  useEffect(() => {
    if (!chainCode || isEditing) return;
    const selectedAsset = supportedAssets.find(
      (asset) => asset.chainCode === chainCode && asset.assetCode === assetCode,
    );
    if (selectedAsset?.network) {
      form.setFieldValue("network", selectedAsset.network);
    }
  }, [chainCode, assetCode, supportedAssets, form, isEditing]);

  const handleApiError = (err: unknown) => {
    if (handleDashboardApiError(err)) return;
    if (err instanceof ApiError) {
      const code = String(err.code ?? "");
      if (KNOWN_ERROR_CODES.includes(code)) {
        message.error(tErrors(code));
        return;
      }
      message.error(err.message);
      return;
    }
    message.error(tErrors("unknown"));
  };

  const canSubmit =
    Boolean(chainCode && assetCode) &&
    addressState === "valid" &&
    confirmed &&
    !submitting;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!validateDepositAddress(values.chainCode, values.depositAddress)) {
        message.error(tErrors("INVALID_ADDRESS"));
        return;
      }
      if (!confirmed) {
        message.warning(t("confirm_required"));
        return;
      }

      setSubmitting(true);
      try {
        if (isEditing && editingWallet) {
          const payload: CryptoDepositWalletUpdateRequest = {
            depositAddress: values.depositAddress.trim(),
            label: values.label?.trim() || undefined,
          };
          await api.cryptoDepositWallets.update(editingWallet.id, payload, accessToken);
        } else {
          const selectedAsset = supportedAssets.find(
            (asset) => asset.chainCode === values.chainCode && asset.assetCode === values.assetCode,
          );
          const payload: CryptoDepositWalletCreateRequest = {
            chainCode: values.chainCode,
            assetCode: values.assetCode,
            network: values.network ?? selectedAsset?.network ?? "mainnet",
            depositAddress: values.depositAddress.trim(),
            label: values.label?.trim() || undefined,
          };
          await api.cryptoDepositWallets.create(payload, accessToken);
        }
        message.success(t("success"));
        onSuccess();
        onClose();
      } catch (err) {
        handleApiError(err);
      } finally {
        setSubmitting(false);
      }
    } catch {
      // antd validation errors
    }
  };

  const addressClassName = [
    styles.addressInput,
    addressState === "valid" ? styles.addressInputValid : "",
    addressState === "invalid" ? styles.addressInputInvalid : "",
  ]
    .filter(Boolean)
    .join(" ");

  const titleNode = (
    <div>
      <div>{isEditing ? t("edit_title") : t("create_title")}</div>
      <p className={styles.drawerSubtitle}>{t("subtitle")}</p>
    </div>
  );

  return (
    <Drawer
      className={styles.drawer}
      title={titleNode}
      open={isOpen}
      onClose={onClose}
      width={480}
      destroyOnHidden
      footer={
        <div className={styles.footer}>
          <Button className={styles.cancelBtn} onClick={onClose} disabled={submitting}>
            {t("cancel")}
          </Button>
          <Button
            type="primary"
            className={styles.submitBtn}
            loading={submitting}
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            {t("submit")}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" requiredMark={false} className={styles.form} disabled={submitting}>
        <div className={styles.row2}>
          <Form.Item
            name="chainCode"
            label={t("chain")}
            rules={[{ required: true, message: t("chain_required") }]}
          >
            <Select
              className={styles.fieldSelect}
              options={chainOptions}
              disabled={isEditing}
              placeholder={t("chain_placeholder")}
              onChange={() => form.setFieldValue("assetCode", undefined)}
            />
          </Form.Item>
          <Form.Item
            name="assetCode"
            label={t("asset")}
            rules={[{ required: true, message: t("asset_required") }]}
          >
            <Select
              className={styles.fieldSelect}
              options={assetOptions}
              disabled={isEditing || !chainCode}
              placeholder={t("asset_placeholder")}
            />
          </Form.Item>
        </div>

        <Form.Item name="network" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          name="depositAddress"
          label={
            <div className={styles.addressLabelRow}>
              <span>{t("deposit_address")}</span>
              {formatHint ? <span className={styles.addressHint}>{formatHint}</span> : null}
            </div>
          }
          rules={[
            { required: true, message: t("address_required") },
            {
              validator: async (_, value) => {
                const raw = String(value ?? "").trim();
                if (!raw) return;
                if (!chainCode || !validateDepositAddress(chainCode, raw)) {
                  throw new Error(t("address_invalid"));
                }
              },
            },
          ]}
          getValueFromEvent={(event: { target: { value: string } }) =>
            event.target.value.replace(/\s+/g, "")
          }
        >
          <Input.TextArea
            className={addressClassName}
            rows={2}
            placeholder={t("address_placeholder")}
            autoComplete="off"
            spellCheck={false}
          />
        </Form.Item>

        {addressState !== "empty" ? (
          <div
            className={`${styles.validationRow} ${
              addressState === "valid" ? styles.validationValid : styles.validationInvalid
            }`}
          >
            {addressState === "valid" ? (
              <>
                <CheckCircle2 size={13} />
                {t("address_valid")}
              </>
            ) : (
              <>
                <AlertTriangle size={13} />
                {t("address_invalid")}
              </>
            )}
          </div>
        ) : null}

        <Form.Item name="label" label={t("label")}>
          <Input className={styles.fieldInput} placeholder={t("label_placeholder")} />
        </Form.Item>

        <div className={styles.confirmCard}>
          <div className={styles.confirmWarn}>
            <AlertTriangle size={16} className={styles.confirmWarnIcon} />
            <p className={styles.confirmWarnText}>{t("confirm_warning")}</p>
          </div>
          <Checkbox
            className={styles.confirmCheck}
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
          >
            {t("confirm_private_key")}
          </Checkbox>
        </div>
      </Form>
    </Drawer>
  );
}
