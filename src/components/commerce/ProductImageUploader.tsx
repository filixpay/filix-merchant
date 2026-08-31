"use client";

import { App, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import type { UploadProps } from "antd";
import styles from "./ProductImageUploader.module.css";

const MAX_MB = 5;

type ProductImageUploaderProps = {
  value?: string[];
  onChange?: (urls: string[]) => void;
  disabled?: boolean;
  onUpload: (file: File) => Promise<string>;
};

export default function ProductImageUploader({
  value = [],
  onChange,
  disabled = false,
  onUpload,
}: ProductImageUploaderProps) {
  const t = useTranslations("CommerceProducts");
  const { message } = App.useApp();

  const beforeUpload: UploadProps["beforeUpload"] = async (file) => {
    if (file.size > MAX_MB * 1024 * 1024) {
      message.error(t("editor.image_too_large", { size: MAX_MB }));
      return Upload.LIST_IGNORE;
    }
    try {
      const url = await onUpload(file as File);
      onChange?.([...value, url]);
      message.success(t("editor.image_uploaded"));
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("editor.image_upload_failed"));
    }
    return Upload.LIST_IGNORE;
  };

  const removeAt = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const setPrimary = (index: number) => {
    if (index <= 0) {
      return;
    }
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange?.(next);
  };

  return (
    <div>
      <Upload.Dragger
        multiple
        disabled={disabled}
        showUploadList={false}
        beforeUpload={beforeUpload}
        accept="image/jpeg,image/png,image/webp"
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t("editor.upload_hint")}</p>
        <p className="ant-upload-hint">{t("editor.upload_types", { size: MAX_MB })}</p>
      </Upload.Dragger>
      {value.length > 0 ? (
        <div className={styles.grid}>
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={`${styles.thumbCard} ${index === 0 ? styles.thumbCardPrimary : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className={styles.thumbImage} />
              {index === 0 ? <span className={styles.primaryBadge}>{t("editor.primary_image")}</span> : null}
              {!disabled ? (
                <div className={styles.thumbActions}>
                  {index > 0 ? (
                    <button type="button" className={styles.thumbBtn} onClick={() => setPrimary(index)}>
                      {t("editor.set_primary")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={`${styles.thumbBtn} ${styles.thumbBtnDanger}`}
                    onClick={() => removeAt(index)}
                  >
                    {t("editor.remove_image")}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
