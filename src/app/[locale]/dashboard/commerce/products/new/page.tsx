"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { App, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { api, type CommerceCategoryView, type CommerceProductTypeView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import ProductEditorForm, {
  type ProductEditorFormValues,
  type ProductEditorValues,
} from "@/components/commerce/ProductEditorForm";
import ProductFormFooter from "@/components/commerce/ProductFormFooter";

function newClientRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `client-${Date.now()}`;
}

export default function CommerceProductCreatePage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("CommerceProducts");
  const tCommon = useTranslations("Common");
  const { message } = App.useApp();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const clientRequestIdRef = useRef<string>(newClientRequestId());
  const [form] = Form.useForm<ProductEditorFormValues>();
  const [categories, setCategories] = useState<CommerceCategoryView[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productTypes, setProductTypes] = useState<CommerceProductTypeView[]>([]);
  const [productTypesLoading, setProductTypesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      setCategoriesLoading(false);
      setProductTypesLoading(false);
      return;
    }
    api.commerce.categories
      .list(accessToken)
      .then(setCategories)
      .catch((err) => message.error(err instanceof Error ? err.message : tCommon("error")))
      .finally(() => setCategoriesLoading(false));
    api.commerce.productTypes
      .list(accessToken)
      .then(setProductTypes)
      .catch((err) => message.error(err instanceof Error ? err.message : tCommon("error")))
      .finally(() => setProductTypesLoading(false));
  }, [accessToken, message, tCommon]);

  const createProduct = async (values: ProductEditorValues, publishAfterCreate: boolean) => {
    if (!accessToken) {
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.commerce.products.create(accessToken, {
        ...values,
        clientRequestId: clientRequestIdRef.current,
      });
      if (publishAfterCreate) {
        await api.commerce.products.publish(accessToken, created.id);
        message.success(t("messages.published"));
      } else {
        message.success(t("messages.created"));
      }
      router.push(`/${locale}/dashboard/commerce/products/${created.id}`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : tCommon("error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (values: ProductEditorValues) => {
    const publishAfterCreate = form.getFieldValue("publishMode") === "publish";
    void createProduct(values, publishAfterCreate);
  };

  const submitWithMode = (publishAfterCreate: boolean) => {
    form.setFieldValue("publishMode", publishAfterCreate ? "publish" : "draft");
    form.submit();
  };

  const backLink = (
    <Link href={`/${locale}/dashboard/commerce/products`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <ArrowLeftOutlined />
      {t("create.back")}
    </Link>
  );

  return (
    <DashboardPage title={t("create.title")} subtitle={backLink} contentMode="form">
      <ProductEditorForm
        form={form}
        mode="create"
        categories={categories}
        categoriesLoading={categoriesLoading}
        productTypes={productTypes}
        productTypesLoading={productTypesLoading}
        disabled={submitting}
        onUploadImage={(file) => api.commerce.media.upload(accessToken!, file).then((r) => r.url)}
        onSubmit={handleSubmit}
      />
      <ProductFormFooter
        formId="commerce-product-editor"
        mode="create"
        loading={submitting}
        disabled={submitting}
        onSaveDraft={() => submitWithMode(false)}
        onPublish={() => submitWithMode(true)}
      />
    </DashboardPage>
  );
}
