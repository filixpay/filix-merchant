"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, SubMerchantView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import SubMerchantTable from "@/components/sub-merchants/SubMerchantTable";
import CreateSubMerchantModal from "@/components/sub-merchants/CreateSubMerchantModal";
import EditSubMerchantModal from "@/components/sub-merchants/EditSubMerchantModal";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

export default function SubMerchantsPage() {
    const [page, setPage] = useState(0);
    const pageSize = 20;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSubMerchant, setSelectedSubMerchant] = useState<SubMerchantView | null>(null);

    const t = useTranslations("SubMerchants");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize),
        [page, pageSize],
    );

    const { items: subMerchants, total, loading, isRefreshing, error, reload } = usePagedResource<
        SubMerchantView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.subMerchants.list(params, token),
    });

    const handleDeleteSubMerchant = async (id: number) => {
        if (!accessToken) return;
        try {
            await api.subMerchants.delete(id, accessToken);
            reload();
        } catch (err) {
            handleDashboardApiError(err);
        }
    };

    const extra = (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            {t("create_sub_merchant")}
        </Button>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} extra={extra}>
            {accessToken ? (
                <SubMerchantTable
                    subMerchants={subMerchants}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    onRetry={reload}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onEdit={(merchant) => {
                        setSelectedSubMerchant(merchant);
                        setIsEditModalOpen(true);
                    }}
                    onDelete={handleDeleteSubMerchant}
                />
            ) : null}

            {accessToken ? (
                <>
                    <CreateSubMerchantModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={reload}
                        accessToken={accessToken}
                    />
                    <EditSubMerchantModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedSubMerchant(null);
                        }}
                        onSuccess={reload}
                        accessToken={accessToken}
                        subMerchant={selectedSubMerchant}
                    />
                </>
            ) : null}
        </DashboardPage>
    );
}
