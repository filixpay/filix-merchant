"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, LocationView, SubMerchantView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import LocationTable from "@/components/locations/LocationTable";
import CreateLocationModal from "@/components/locations/CreateLocationModal";
import EditLocationModal from "@/components/locations/EditLocationModal";
import LocationQrCodeModal from "@/components/locations/LocationQrCodeModal";
import { buildPagedListParams } from "@/lib/dashboard/build-paged-list-params";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";
import { usePagedResource } from "@/lib/dashboard/use-paged-resource";

export default function LocationsPage() {
    const [page, setPage] = useState(0);
    const pageSize = 20;
    const [subMerchants, setSubMerchants] = useState<SubMerchantView[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<LocationView | null>(null);

    const t = useTranslations("Locations");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const requestParams = useMemo(
        () => buildPagedListParams(page, pageSize, {}, { page: "pageNumber", size: "pageSize" }),
        [page, pageSize],
    );

    const { items: locations, total, loading, isRefreshing, error, reload } = usePagedResource<
        LocationView,
        Record<string, string | number>
    >({
        accessToken,
        params: requestParams,
        fetcher: (params, token) => api.locations.list(params, token),
    });

    const loadSubMerchants = useCallback(async () => {
        if (!accessToken) return;
        try {
            const subMerchantsRes = await api.subMerchants.list({ page: 0, size: 100 }, accessToken);
            setSubMerchants(subMerchantsRes.data || []);
        } catch (err) {
            console.error(err);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            loadSubMerchants();
        }
    }, [accessToken, loadSubMerchants]);

    const handleDeleteLocation = async (id: number) => {
        if (!accessToken) return;
        try {
            await api.locations.delete(id, accessToken);
            reload();
        } catch (err) {
            handleDashboardApiError(err);
        }
    };

    const extra = (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
            {t("create_location")}
        </Button>
    );

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} extra={extra}>
            {accessToken ? (
                <LocationTable
                    locations={locations}
                    subMerchants={subMerchants}
                    loading={loading}
                    isRefreshing={isRefreshing}
                    error={error}
                    onRetry={reload}
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onEdit={(location) => {
                        setSelectedLocation(location);
                        setShowEditModal(true);
                    }}
                    onDelete={handleDeleteLocation}
                    onShowQr={(location) => {
                        setSelectedLocation(location);
                        setShowQrModal(true);
                    }}
                />
            ) : null}

            {accessToken ? (
                <>
                    <CreateLocationModal
                        isOpen={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSuccess={reload}
                        accessToken={accessToken}
                    />
                    <EditLocationModal
                        isOpen={showEditModal}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedLocation(null);
                        }}
                        onSuccess={reload}
                        accessToken={accessToken}
                        location={selectedLocation}
                    />
                    <LocationQrCodeModal
                        isOpen={showQrModal}
                        onClose={() => {
                            setShowQrModal(false);
                            setSelectedLocation(null);
                        }}
                        locationId={selectedLocation?.id ?? null}
                        locationName={selectedLocation?.name ?? null}
                        accessToken={accessToken}
                    />
                </>
            ) : null}
        </DashboardPage>
    );
}
