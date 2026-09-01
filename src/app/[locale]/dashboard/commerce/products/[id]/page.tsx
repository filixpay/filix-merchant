"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { App, Card, Descriptions, Skeleton, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { api, type CommerceCategoryView, type CommerceProductTypeView, type CommerceProductView } from "@/lib/api";
import { canEdit, isInFlightIntegration } from "@/lib/api/domains/commerce";
import { getActivationStatus } from "@/lib/api/domains/commerce/activation";
import {
    ACTIVATION_POLL_INTERVAL_MS,
    ACTIVATION_POLL_TIMEOUT_MS,
    decideActivationPoll,
} from "@/lib/commerce/activation-polling";
import DashboardPage from "@/components/layout/DashboardPage";
import ProductEditorForm, { type ProductEditorValues } from "@/components/commerce/ProductEditorForm";
import ProductFormFooter from "@/components/commerce/ProductFormFooter";
import ProductStatusBadges from "@/components/commerce/ProductStatusBadges";
import PublishActions from "@/components/commerce/PublishActions";

const POLL_MS = 2500;
const POLL_MAX_MS = 120_000;

export default function CommerceProductDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("CommerceProducts");
    const tCommon = useTranslations("Common");
    const { message } = App.useApp();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [product, setProduct] = useState<CommerceProductView | null>(null);
    const [categories, setCategories] = useState<CommerceCategoryView[]>([]);
    const [productTypes, setProductTypes] = useState<CommerceProductTypeView[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const pollStartedRef = useRef<number | null>(null);
    const activationPollStartedRef = useRef<number | null>(null);
    const activationPollTimerRef = useRef<number | null>(null);

    const loadProduct = useCallback(async () => {
        if (!accessToken || !params.id) {
            return null;
        }
        const detail = await api.commerce.products.get(accessToken, params.id);
        setProduct(detail);
        return detail;
    }, [accessToken, params.id]);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        Promise.all([
            loadProduct().catch((err) => {
                message.error(err instanceof Error ? err.message : tCommon("error"));
                return null;
            }),
            api.commerce.categories.list(accessToken).then(setCategories).catch(() => []),
            api.commerce.productTypes.list(accessToken).then(setProductTypes).catch(() => []),
        ]).finally(() => setLoading(false));
    }, [accessToken, loadProduct, message, tCommon]);

    useEffect(() => {
        if (!accessToken || !product || !isInFlightIntegration(product.integrationStatus)) {
            pollStartedRef.current = null;
            return;
        }
        if (pollStartedRef.current === null) {
            pollStartedRef.current = Date.now();
        }
        const timer = window.setInterval(async () => {
            if (pollStartedRef.current && Date.now() - pollStartedRef.current > POLL_MAX_MS) {
                window.clearInterval(timer);
                return;
            }
            try {
                const refreshed = await loadProduct();
                if (refreshed && !isInFlightIntegration(refreshed.integrationStatus)) {
                    window.clearInterval(timer);
                    pollStartedRef.current = null;
                }
            } catch {
                /* keep polling until timeout */
            }
        }, POLL_MS);
        return () => window.clearInterval(timer);
    }, [accessToken, product?.integrationStatus, product?.id, loadProduct]);

    const backLink = (
        <Link href={`/${locale}/dashboard/commerce/products`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <ArrowLeftOutlined />
            {t("detail.back")}
        </Link>
    );

    const handleSave = async (values: ProductEditorValues) => {
        if (!accessToken || !product) {
            return;
        }
        setSaving(true);
        try {
            const updated = await api.commerce.products.update(accessToken, product.id, values);
            setProduct(updated);
            message.success(t("messages.saved"));
        } catch (err) {
            message.error(err instanceof Error ? err.message : tCommon("error"));
        } finally {
            setSaving(false);
        }
    };

    const stopActivationPoll = useCallback(() => {
        if (activationPollTimerRef.current !== null) {
            window.clearInterval(activationPollTimerRef.current);
            activationPollTimerRef.current = null;
        }
        activationPollStartedRef.current = null;
    }, []);

    useEffect(() => () => stopActivationPoll(), [stopActivationPoll]);

    const startActivationPollAfterPublish = useCallback(() => {
        if (!accessToken) {
            return;
        }
        stopActivationPoll();
        activationPollStartedRef.current = Date.now();

        const tick = async () => {
            const startedAt = activationPollStartedRef.current ?? Date.now();
            const elapsedMs = Date.now() - startedAt;
            try {
                const status = await getActivationStatus(accessToken);
                if (status.phase === "ACTIVATED" && status.shouldShowFirstPublishCelebration) {
                    stopActivationPoll();
                    router.push(`/${locale}/dashboard`);
                    return;
                }
                const decision = decideActivationPoll(status.phase, elapsedMs);
                if (decision.action === "timeout" || decision.action === "stop") {
                    stopActivationPoll();
                    void loadProduct();
                }
            } catch {
                if (elapsedMs >= ACTIVATION_POLL_TIMEOUT_MS) {
                    stopActivationPoll();
                }
            }
        };

        void tick();
        activationPollTimerRef.current = window.setInterval(() => {
            void tick();
        }, ACTIVATION_POLL_INTERVAL_MS);
    }, [accessToken, locale, loadProduct, router, stopActivationPoll]);

    const handlePublish = async () => {
        if (!accessToken || !product) {
            return;
        }
        setActionLoading(true);
        try {
            const updated = await api.commerce.products.publish(accessToken, product.id);
            setProduct(updated);
            // HTTP 200 = accepted, not celebration-ready. Stay on detail and poll activation-status.
            message.success(t("messages.publishing"));
            startActivationPollAfterPublish();
        } catch (err) {
            message.error(err instanceof Error ? err.message : tCommon("error"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnpublish = async () => {
        if (!accessToken || !product) {
            return;
        }
        setActionLoading(true);
        try {
            const updated = await api.commerce.products.unpublish(accessToken, product.id);
            setProduct(updated);
            message.success(t("messages.unpublished"));
        } catch (err) {
            message.error(err instanceof Error ? err.message : tCommon("error"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleRetrySync = async () => {
        if (!accessToken || !product) {
            return;
        }
        setActionLoading(true);
        try {
            const updated = await api.commerce.products.retrySync(accessToken, product.id);
            setProduct(updated);
            message.success(t("messages.synced"));
        } catch (err) {
            message.error(err instanceof Error ? err.message : tCommon("error"));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardPage title={t("detail.title")} subtitle={backLink}>
                <Skeleton active paragraph={{ rows: 10 }} />
            </DashboardPage>
        );
    }

    if (!product) {
        return (
            <DashboardPage title={t("detail.title")} subtitle={backLink}>
                <Typography.Text type="danger">{t("detail.not_found")}</Typography.Text>
            </DashboardPage>
        );
    }

    const editable = canEdit(product);

    return (
        <DashboardPage
            title={product.title}
            subtitle={backLink}
            contentMode="form"
            extra={
                <PublishActions
                    product={product}
                    loading={actionLoading}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onRetrySync={handleRetrySync}
                />
            }
        >
            <Card style={{ marginBottom: 16 }}>
                <Descriptions column={1} size="small">
                    <Descriptions.Item label={t("detail.status")}>
                        <ProductStatusBadges product={product} />
                    </Descriptions.Item>
                    {product.externalProductId ? (
                        <Descriptions.Item label={t("detail.external_id")}>{product.externalProductId}</Descriptions.Item>
                    ) : null}
                    {product.lastError ? (
                        <Descriptions.Item label={t("detail.last_error")}>{product.lastError}</Descriptions.Item>
                    ) : null}
                </Descriptions>
            </Card>

            {editable ? (
                <>
                    <ProductEditorForm
                        mode="edit"
                        categories={categories}
                        productTypes={productTypes}
                        productTypeLocked={Boolean(product.externalProductId)}
                        disabled={saving || isInFlightIntegration(product.integrationStatus)}
                        initialValues={{
                            title: product.title,
                            description: product.description,
                            categoryId: product.categoryId,
                            productTypeId: product.productTypeId,
                            sku: product.sku,
                            price: product.price ?? undefined,
                            stock: product.stock,
                            images: product.images,
                        }}
                        onUploadImage={(file) => api.commerce.media.upload(accessToken!, file).then((r) => r.url)}
                        onSubmit={handleSave}
                    />
                    <ProductFormFooter
                        formId="commerce-product-editor"
                        mode="edit"
                        loading={saving}
                        disabled={saving || isInFlightIntegration(product.integrationStatus)}
                    />
                </>
            ) : (
                <Card>
                    <Typography.Paragraph>{t("detail.read_only_hint")}</Typography.Paragraph>
                </Card>
            )}
        </DashboardPage>
    );
}
