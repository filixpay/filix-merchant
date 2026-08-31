"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { App, Button, Flex, Input, Select } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { api, type CommerceCategoryView, type CommerceProductView } from "@/lib/api";
import { canUnpublish, isInFlightIntegration } from "@/lib/api/domains/commerce";
import {
  matchesProductListFilters,
  type ProductListFilters,
  type ProductListStatusFilter,
} from "@/lib/api/domains/commerce/product-list-filters";
import DashboardPage from "@/components/layout/DashboardPage";
import ProductListTable from "@/components/commerce/ProductListTable";
import styles from "./commerce-products-page.module.css";

const LIST_PAGE = 0;
const LIST_SIZE = 50;

const STATUS_OPTIONS: ProductListStatusFilter[] = [
  "all",
  "published",
  "suspended",
  "draft",
  "syncing",
];

export default function CommerceProductsPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("CommerceProducts");
  const tCommon = useTranslations("Common");
  const { message, modal } = App.useApp();
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  const [products, setProducts] = useState<CommerceProductView[]>([]);
  const [categories, setCategories] = useState<CommerceCategoryView[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [queryInput, setQueryInput] = useState("");
  const [filters, setFilters] = useState<ProductListFilters>({
    query: "",
    categoryId: null,
    status: "all",
  });

  const loadProducts = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const rows = await api.commerce.products.list(accessToken, { page: LIST_PAGE, size: LIST_SIZE });
      setProducts(rows);
    } catch (err) {
      message.error(err instanceof Error ? err.message : tCommon("error"));
    } finally {
      setLoading(false);
    }
  }, [accessToken, message, tCommon]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    api.commerce.categories
      .list(accessToken)
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [accessToken]);

  useEffect(() => {
    const onFocus = () => {
      if (products.some((p) => isInFlightIntegration(p.integrationStatus))) {
        void loadProducts();
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadProducts, products]);

  const filteredProducts = useMemo(
    () => products.filter((p) => matchesProductListFilters(p, filters)),
    [products, filters],
  );

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedRowKeys.includes(p.id)),
    [products, selectedRowKeys],
  );

  const applyFilters = () => {
    setFilters((prev) => ({ ...prev, query: queryInput.trim() }));
    setSelectedRowKeys([]);
  };

  const resetFilters = () => {
    setQueryInput("");
    setFilters({ query: "", categoryId: null, status: "all" });
    setSelectedRowKeys([]);
  };

  const runAction = async (id: string, action: "publish" | "unpublish" | "retrySync") => {
    if (!accessToken) {
      return;
    }
    setActionLoadingId(id);
    try {
      if (action === "retrySync") {
        await api.commerce.products.retrySync(accessToken, id);
        message.success(t("messages.synced"));
        await loadProducts();
        return;
      }
      const updated =
        action === "publish"
          ? await api.commerce.products.publish(accessToken, id)
          : await api.commerce.products.unpublish(accessToken, id);
      message.success(action === "publish" ? t("messages.published") : t("messages.unpublished"));
      router.push(`/${locale}/dashboard/commerce/products/${updated.id}`);
    } catch (err) {
      message.error(err instanceof Error ? err.message : tCommon("error"));
      await loadProducts();
    } finally {
      setActionLoadingId(null);
    }
  };

  const confirmDelete = (product: CommerceProductView) => {
    modal.confirm({
      title: t("delete.confirm_title"),
      content: t("delete.confirm_body"),
      okText: t("actions.delete"),
      okButtonProps: { danger: true },
      cancelText: t("actions.cancel"),
      onOk: async () => {
        if (!accessToken) {
          return;
        }
        setActionLoadingId(product.id);
        try {
          await api.commerce.products.delete(accessToken, product.id);
          message.success(t("messages.deleted"));
          setSelectedRowKeys((keys) => keys.filter((k) => k !== product.id));
          await loadProducts();
        } catch (err) {
          message.error(err instanceof Error ? err.message : tCommon("error"));
          await loadProducts();
          throw err;
        } finally {
          setActionLoadingId(null);
        }
      },
    });
  };

  const bulkUnpublish = () => {
    const targets = selectedProducts.filter((p) => canUnpublish(p));
    if (targets.length === 0) {
      message.warning(t("bulk.no_unpublishable"));
      return;
    }
    modal.confirm({
      title: t("bulk.unpublish_title"),
      content: t("bulk.unpublish_body", { count: targets.length }),
      okText: t("actions.unpublish"),
      cancelText: t("actions.cancel"),
      onOk: async () => {
        if (!accessToken) {
          return;
        }
        setLoading(true);
        try {
          for (const product of targets) {
            await api.commerce.products.unpublish(accessToken, product.id);
          }
          message.success(t("bulk.unpublish_done", { count: targets.length }));
          setSelectedRowKeys([]);
          await loadProducts();
        } catch (err) {
          message.error(err instanceof Error ? err.message : tCommon("error"));
          await loadProducts();
          throw err;
        }
      },
    });
  };

  const bulkDelete = () => {
    if (selectedProducts.length === 0) {
      return;
    }
    modal.confirm({
      title: t("bulk.delete_title"),
      content: t("bulk.delete_body", { count: selectedProducts.length }),
      okText: t("actions.delete"),
      okButtonProps: { danger: true },
      cancelText: t("actions.cancel"),
      onOk: async () => {
        if (!accessToken) {
          return;
        }
        setLoading(true);
        try {
          for (const product of selectedProducts) {
            await api.commerce.products.delete(accessToken, product.id);
          }
          message.success(t("bulk.delete_done", { count: selectedProducts.length }));
          setSelectedRowKeys([]);
          await loadProducts();
        } catch (err) {
          message.error(err instanceof Error ? err.message : tCommon("error"));
          await loadProducts();
          throw err;
        }
      },
    });
  };

  const filterBar = (
    <div className={styles.filterRow}>
      <Input
        allowClear
        prefix={<SearchOutlined />}
        placeholder={t("filters.search_placeholder")}
        style={{ width: 260, flex: "1 1 220px" }}
        value={queryInput}
        onChange={(e) => setQueryInput(e.target.value)}
        onPressEnter={applyFilters}
      />
      <Select
        allowClear
        placeholder={t("filters.category_all")}
        style={{ minWidth: 160 }}
        value={filters.categoryId ?? undefined}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        onChange={(value) => {
          setFilters((prev) => ({ ...prev, categoryId: value ?? null }));
          setSelectedRowKeys([]);
        }}
      />
      <Select
        style={{ minWidth: 140 }}
        value={filters.status}
        options={STATUS_OPTIONS.map((value) => ({
          value,
          label: t(`filters.status_${value}`),
        }))}
        onChange={(value: ProductListStatusFilter) => {
          setFilters((prev) => ({ ...prev, status: value }));
          setSelectedRowKeys([]);
        }}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={applyFilters}>
        {t("filters.search")}
      </Button>
      <Button icon={<ReloadOutlined />} onClick={resetFilters}>
        {t("filters.reset")}
      </Button>
    </div>
  );

  return (
    <DashboardPage
      title={t("list.title")}
      subtitle={t("list.subtitle")}
      filterBar={filterBar}
      contentMode="table"
      extra={
        <Link href={`/${locale}/dashboard/commerce/products/new`}>
          <Button type="primary" icon={<PlusOutlined />}>
            {t("list.create")}
          </Button>
        </Link>
      }
    >
      <Flex vertical gap={12}>
        {selectedRowKeys.length > 0 ? (
          <div className={styles.bulkBar}>
            <span className={styles.bulkCount}>
              {t("bulk.selected", { count: selectedRowKeys.length })}
            </span>
            <Button size="small" onClick={bulkUnpublish}>
              {t("bulk.unpublish")}
            </Button>
            <Button size="small" danger onClick={bulkDelete}>
              {t("bulk.delete")}
            </Button>
          </div>
        ) : null}
        <ProductListTable
          products={filteredProducts}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          onSelectionChange={setSelectedRowKeys}
          onPublish={(p) => runAction(p.id, "publish")}
          onUnpublish={(p) => runAction(p.id, "unpublish")}
          onRetrySync={(p) => runAction(p.id, "retrySync")}
          onDelete={confirmDelete}
          actionLoadingId={actionLoadingId}
        />
      </Flex>
    </DashboardPage>
  );
}
