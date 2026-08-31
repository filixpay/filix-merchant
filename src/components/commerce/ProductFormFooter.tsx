"use client";

import { Button } from "antd";
import { useTranslations } from "next-intl";
import styles from "./ProductFormFooter.module.css";

type ProductFormFooterProps = {
  formId: string;
  mode: "create" | "edit";
  loading?: boolean;
  disabled?: boolean;
  onSaveDraft?: () => void;
  onPublish?: () => void;
};

export default function ProductFormFooter({
  formId,
  mode,
  loading = false,
  disabled = false,
  onSaveDraft,
  onPublish,
}: ProductFormFooterProps) {
  const t = useTranslations("CommerceProducts");

  return (
    <div className={styles.footer}>
      <div className={styles.inner}>
        {mode === "create" ? (
          <>
            <Button disabled={disabled || loading} onClick={onSaveDraft}>
              {t("create.save_draft")}
            </Button>
            <Button type="primary" disabled={disabled} loading={loading} onClick={onPublish}>
              {t("create.publish")}
            </Button>
          </>
        ) : (
          <Button type="primary" htmlType="submit" form={formId} loading={loading} disabled={disabled}>
            {t("actions.save")}
          </Button>
        )}
      </div>
    </div>
  );
}
