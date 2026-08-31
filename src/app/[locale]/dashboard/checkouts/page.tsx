"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslations, useLocale } from "next-intl";
import {
    api,
    CheckoutView,
    MerchantCheckoutRequest,
    PaymentConfigView,
} from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import CheckoutTable from "@/components/checkouts/CheckoutTable";
import CheckoutFormModal, { type CheckoutFormState } from "@/components/checkouts/CheckoutFormModal";
import { mapCheckoutToForm } from "@/components/checkouts/checkout-model";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";
import { useTableQueryState } from "@/lib/dashboard/use-table-query-state";

const EMPTY_CHECKOUT: CheckoutFormState = {
    checkoutCode: "",
    titles: { "zh-CN": "", en: "", "ja-JP": "" },
    logo: "",
    color: "#0080FF",
    currencies: ["CNY", "USD", "*"],
    buyerCountries: ["CN", "US", "*"],
    configs: [],
};

export default function CheckoutsPage() {
    const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfigView[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCheckout, setEditingCheckout] = useState<CheckoutFormState | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const t = useTranslations("Checkouts");
    const { data: session } = useSession();
    const locale = useLocale();
    const accessToken = session?.accessToken;
    const { page, pageSize, setPagination } = useTableQueryState();

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, {}, { page: "pageNumber", size: "pageSize" }),
        [page, pageSize],
    );

    const { items: checkouts, total, loading, isRefreshing, error, reload } = usePagedResource<
        CheckoutView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.checkouts.list(params, token),
    });

    const loadPaymentConfigs = useCallback(async () => {
        if (!accessToken) return;
        try {
            const data = await api.configs.list({ pageSize: 100 }, accessToken);
            setPaymentConfigs(data.data || []);
        } catch (err) {
            console.error("Failed to load payment configs", err);
            handleDashboardApiError(err);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            loadPaymentConfigs();
        }
    }, [accessToken, loadPaymentConfigs]);

    const handleCreate = () => {
        setEditingCheckout({ ...EMPTY_CHECKOUT });
        setIsModalOpen(true);
    };

    const handleEdit = (checkout: CheckoutView) => {
        setEditingCheckout(mapCheckoutToForm(checkout));
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!accessToken) return;
        try {
            await api.checkouts.delete(id, accessToken);
            reload();
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(err instanceof Error ? err.message : "Error deleting");
            }
        }
    };

    const toggleStatus = async (checkout: CheckoutView) => {
        if (!accessToken) return;
        try {
            if (checkout.checkoutStatus === "ACTIVE") {
                await api.checkouts.deactivate(checkout.id, accessToken);
            } else {
                await api.checkouts.activate(checkout.id, accessToken);
            }
            reload();
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(err instanceof Error ? err.message : "Error updating status");
            }
        }
    };

    const saveCheckout = async (requestData: MerchantCheckoutRequest) => {
        if (!accessToken || !editingCheckout) return;
        setSubmitting(true);
        try {
            if (editingCheckout.id) {
                await api.checkouts.update(editingCheckout.id, requestData, accessToken);
            } else {
                await api.checkouts.create(requestData, accessToken);
            }
            setIsModalOpen(false);
            setEditingCheckout(null);
            reload();
            message.success(t("create_counter"));
        } catch (err) {
            if (!handleDashboardApiError(err)) {
                message.error(err instanceof Error ? err.message : "Error saving");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const extra = (
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t("create_counter")}
        </Button>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} extra={extra}>
            {accessToken ? (
                <CheckoutTable
                    checkouts={checkouts}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    locale={locale}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPagination}
                    onRetry={reload}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={toggleStatus}
                />
            ) : null}

            {accessToken ? (
                <CheckoutFormModal
                    open={isModalOpen}
                    checkout={editingCheckout}
                    paymentConfigs={paymentConfigs}
                    submitting={submitting}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingCheckout(null);
                    }}
                    onSubmit={saveCheckout}
                />
            ) : null}
        </DashboardPage>
    );
}
