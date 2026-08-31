"use client";

import { useEffect, useState } from "react";
import { AutoComplete, Button, Form, Input, Modal, Switch, message } from "antd";
import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { api, BankAccountCreateRequest } from "@/lib/api";
import { COMMON_BANK_NAMES, COMMON_CITIES } from "./bank-account-model";
import styles from "./CreateBankAccountModal.module.css";

type CreateBankAccountFormValues = BankAccountCreateRequest;

interface CreateBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string;
  hasPrimaryAccount: boolean;
}

export default function CreateBankAccountModal({
  isOpen,
  onClose,
  onSuccess,
  accessToken,
  hasPrimaryAccount,
}: CreateBankAccountModalProps) {
  const t = useTranslations("BankAccounts.form");
  const [form] = Form.useForm<CreateBankAccountFormValues>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    form.setFieldsValue({
      bankName: undefined,
      bankBranchName: undefined,
      bankAccountHolder: undefined,
      bankAccountNumber: undefined,
      city: undefined,
      primary: !hasPrimaryAccount,
    });
  }, [form, hasPrimaryAccount, isOpen]);

  const handleSubmit = async (values: CreateBankAccountFormValues) => {
    setSubmitting(true);
    try {
      await api.bankAccounts.create(
        {
          bankName: values.bankName.trim(),
          bankBranchName: values.bankBranchName.trim(),
          bankAccountHolder: values.bankAccountHolder.trim(),
          bankAccountNumber: values.bankAccountNumber.replace(/\s+/g, ""),
          city: values.city.trim(),
          primary: Boolean(values.primary),
        },
        accessToken,
      );
      message.success(t("success"));
      form.resetFields();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error(err);
      message.error(err instanceof Error ? err.message : t("submit"));
    } finally {
      setSubmitting(false);
    }
  };

  const bankOptions = COMMON_BANK_NAMES.map((name) => ({ value: name }));
  const cityOptions = COMMON_CITIES.map((name) => ({ value: name }));

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width={560}
      className={styles.modal}
      title={null}
      centered
      maskClosable={!submitting}
    >
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Building2 size={18} />
        </div>
        <div>
          <h3 className={styles.headerTitle}>{t("create_title")}</h3>
          <p className={styles.headerSubtitle}>{t("subtitle")}</p>
        </div>
      </div>

      <div className={styles.body}>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className={styles.form}
          initialValues={{ primary: !hasPrimaryAccount }}
          onFinish={(values) => void handleSubmit(values)}
          disabled={submitting}
        >
          <div className={styles.row2}>
            <Form.Item
              name="bankName"
              label={t("bank_name")}
              rules={[{ required: true, message: t("bank_name_required") }]}
            >
              <AutoComplete
                className={styles.fieldSelect}
                options={bankOptions}
                placeholder={t("bank_name_placeholder")}
                filterOption={(input, option) =>
                  String(option?.value ?? "")
                    .toLowerCase()
                    .includes(input.trim().toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              name="city"
              label={t("city")}
              rules={[{ required: true, message: t("city_required") }]}
            >
              <AutoComplete
                className={styles.fieldSelect}
                options={cityOptions}
                placeholder={t("city_placeholder")}
                filterOption={(input, option) =>
                  String(option?.value ?? "")
                    .toLowerCase()
                    .includes(input.trim().toLowerCase())
                }
              />
            </Form.Item>
          </div>

          <Form.Item
            name="bankBranchName"
            label={t("branch_name")}
            rules={[{ required: true, message: t("branch_name_required") }]}
          >
            <Input className={styles.fieldInput} placeholder={t("branch_name_placeholder")} />
          </Form.Item>

          <Form.Item
            name="bankAccountHolder"
            label={t("account_holder")}
            rules={[{ required: true, message: t("account_holder_required") }]}
          >
            <Input className={styles.fieldInput} placeholder={t("account_holder_placeholder")} />
          </Form.Item>

          <Form.Item
            name="bankAccountNumber"
            label={t("account_number")}
            rules={[
              { required: true, message: t("account_number_required") },
              {
                validator: async (_, value) => {
                  const raw = String(value ?? "").replace(/\s+/g, "");
                  if (!raw) return;
                  if (!/^\d{8,32}$/.test(raw)) {
                    throw new Error(t("account_number_invalid"));
                  }
                },
              },
            ]}
            getValueFromEvent={(event: { target: { value: string } }) =>
              event.target.value.replace(/[^\d\s]/g, "")
            }
          >
            <Input
              className={styles.monoInput}
              placeholder={t("account_number_placeholder")}
              inputMode="numeric"
              autoComplete="off"
            />
          </Form.Item>

          <div className={styles.primaryCard}>
            <div>
              <p className={styles.primaryTitle}>{t("primary")}</p>
              <p className={styles.primaryHint}>{t("primary_hint")}</p>
            </div>
            <Form.Item name="primary" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </div>

      <div className={styles.footer}>
        <Button className={styles.cancelBtn} onClick={onClose} disabled={submitting}>
          {t("cancel")}
        </Button>
        <Button
          type="primary"
          className={styles.submitBtn}
          loading={submitting}
          onClick={() => form.submit()}
        >
          {t("submit")}
        </Button>
      </div>
    </Modal>
  );
}
