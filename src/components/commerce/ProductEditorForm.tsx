"use client";

import { Form, Input, InputNumber, Radio, Select } from "antd";
import type { FormInstance } from "antd";
import { useTranslations } from "next-intl";
import type { CommerceCategoryView, CommerceProductTypeView } from "@/lib/api/domains/commerce";
import { COMMERCE_CURRENCY_CODE } from "./format-commerce-price";
import ProductImageUploader from "./ProductImageUploader";
import styles from "./ProductEditorForm.module.css";

export type ProductEditorValues = {
  title: string;
  description?: string;
  categoryId: string;
  productTypeId?: string;
  sku: string;
  price: number;
  stock: number;
  images: string[];
};

export type ProductEditorFormValues = ProductEditorValues & {
  publishMode?: "draft" | "publish";
};

type ProductEditorFormProps = {
  form?: FormInstance<ProductEditorFormValues>;
  categories: CommerceCategoryView[];
  categoriesLoading?: boolean;
  productTypes: CommerceProductTypeView[];
  productTypesLoading?: boolean;
  productTypeLocked?: boolean;
  disabled?: boolean;
  initialValues?: Partial<ProductEditorFormValues>;
  onUploadImage: (file: File) => Promise<string>;
  formId?: string;
  mode?: "create" | "edit";
  onSubmit: (values: ProductEditorValues) => void;
};

export default function ProductEditorForm({
  form: externalForm,
  categories,
  categoriesLoading = false,
  productTypes,
  productTypesLoading = false,
  productTypeLocked = false,
  disabled = false,
  initialValues,
  onUploadImage,
  formId = "commerce-product-editor",
  mode = "create",
  onSubmit,
}: ProductEditorFormProps) {
  const t = useTranslations("CommerceProducts");
  const [internalForm] = Form.useForm<ProductEditorFormValues>();
  const form = externalForm ?? internalForm;

  const handleFinish = (values: ProductEditorFormValues) => {
    const { publishMode: _publishMode, ...payload } = values;
    onSubmit(payload);
  };

  return (
    <Form
      id={formId}
      form={form}
      layout="vertical"
      disabled={disabled}
      initialValues={{
        title: "",
        description: "",
        categoryId: undefined,
        productTypeId: undefined,
        sku: "",
        price: undefined,
        stock: 0,
        images: [],
        publishMode: "draft",
        ...initialValues,
      }}
      onFinish={handleFinish}
    >
      <div className={styles.editorLayout}>
        <div className={styles.mainColumn}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>{t("editor.section_basic")}</h3>
            <Form.Item
              name="title"
              label={t("editor.title")}
              rules={[{ required: true, message: t("editor.title_required") }]}
            >
              <Input maxLength={200} />
            </Form.Item>
            <Form.Item name="description" label={t("editor.description")}>
              <Input.TextArea rows={4} maxLength={4000} />
            </Form.Item>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>{t("editor.section_media")}</h3>
            <Form.Item name="images" label={t("editor.images")} initialValue={[]}>
              <ProductImageUploader disabled={disabled} onUpload={onUploadImage} />
            </Form.Item>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>{t("editor.section_pricing")}</h3>
            <Form.Item
              name="sku"
              label={t("editor.sku")}
              rules={[{ required: true, message: t("editor.sku_required") }]}
            >
              <Input maxLength={64} />
            </Form.Item>
            <Form.Item
              name="price"
              label={t("editor.price")}
              rules={[{ required: true, message: t("editor.price_required") }]}
            >
              <InputNumber
                className={styles.priceInput}
                min={0}
                precision={2}
                style={{ width: "100%" }}
                addonBefore={`${COMMERCE_CURRENCY_CODE} $`}
              />
            </Form.Item>
            <Form.Item
              name="stock"
              label={t("editor.stock")}
              rules={[{ required: true, message: t("editor.stock_required") }]}
            >
              <InputNumber min={0} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </section>
        </div>

        <div className={styles.sideColumn}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>{t("editor.section_organization")}</h3>
            <Form.Item
              name="categoryId"
              label={t("editor.category")}
              rules={[{ required: true, message: t("editor.category_required") }]}
            >
              <Select
                loading={categoriesLoading}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              name="productTypeId"
              label={t("editor.product_type")}
              rules={
                productTypeLocked ? [] : [{ required: true, message: t("editor.product_type_required") }]
              }
            >
              <Select
                disabled={productTypeLocked}
                loading={productTypesLoading}
                options={productTypes.map((pt) => ({ value: pt.id, label: pt.name }))}
                showSearch
                optionFilterProp="label"
                allowClear={!productTypeLocked}
              />
            </Form.Item>
          </section>

          {mode === "create" ? (
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>{t("editor.section_publish")}</h3>
              <p className={styles.publishHint}>{t("editor.publish_hint")}</p>
              <Form.Item name="publishMode" label={t("editor.publish_mode")}>
                <Radio.Group>
                  <Radio value="draft">{t("editor.publish_mode_draft")}</Radio>
                  <Radio value="publish">{t("editor.publish_mode_live")}</Radio>
                </Radio.Group>
              </Form.Item>
            </section>
          ) : null}
        </div>
      </div>
    </Form>
  );
}
