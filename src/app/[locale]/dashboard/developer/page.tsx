"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Tabs } from "antd";
import { useTranslations } from "next-intl";
import {
    api,
    ApiError,
    WebhookDeliveryView,
    WebhookEndpointRequest,
    WebhookEndpointView,
} from "@/lib/api";
import { createSandboxSession } from "@/lib/sandbox-client";
import DashboardPage from "@/components/layout/DashboardPage";
import ApplicationsPanel from "@/components/developer/ApplicationsPanel";
import ExplorerPanel from "@/components/developer/ExplorerPanel";
import IntegrationSandboxPanel from "@/components/developer/IntegrationSandboxPanel";
import ProductionAccessPanel from "@/components/developer/ProductionAccessPanel";
import WebhookPanel from "@/components/developer/WebhookPanel";
import WebhookDeliveriesPanel from "@/components/developer/WebhookDeliveriesPanel";

export default function DeveloperPage() {
    const t = useTranslations("Developer");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [activeTab, setActiveTab] = useState("applications");
    const [sandboxRefreshKey, setSandboxRefreshKey] = useState(0);
    const [webhooks, setWebhooks] = useState<WebhookEndpointView[]>([]);
    const [webhookDeliveries, setWebhookDeliveries] = useState<WebhookDeliveryView[]>([]);
    const [loading, setLoading] = useState(true);
    const [deliveriesLoading, setDeliveriesLoading] = useState(false);
    const [webhooksError, setWebhooksError] = useState<unknown | null>(null);
    const [deliveriesError, setDeliveriesError] = useState<unknown | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [createdWebhook, setCreatedWebhook] = useState<WebhookEndpointView | null>(null);

    const loadWebhooks = useCallback(async () => {
        if (!accessToken) return;
        setLoading(true);
        setWebhooksError(null);
        try {
            const res = await api.developer.listWebhookEndpoints({ page: 0, size: 100 }, accessToken);
            setWebhooks(res.data || res.content || []);
        } catch (err) {
            console.error(err);
            setWebhooksError(err);
            if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    const loadDeliveries = useCallback(async () => {
        if (!accessToken) return;
        setDeliveriesLoading(true);
        setDeliveriesError(null);
        try {
            const res = await api.developer.listWebhookDeliveries({ page: 0, size: 20 }, accessToken);
            setWebhookDeliveries(res.data || res.content || []);
        } catch (err) {
            console.error(err);
            setDeliveriesError(err);
            if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
        } finally {
            setDeliveriesLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
            loadWebhooks();
            loadDeliveries();
        }
    }, [accessToken, loadWebhooks, loadDeliveries]);

    const handleCreateWebhook = async (
        data: WebhookEndpointRequest,
    ): Promise<WebhookEndpointView> => {
        if (!accessToken) throw new Error("No access token");
        setSubmitting(true);
        try {
            const newWebhook = await api.developer.createWebhookEndpoint(data, accessToken);
            setCreatedWebhook(newWebhook);
            await loadWebhooks();
            return newWebhook;
        } catch (err) {
            console.error(err);
            if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const handlePatchWebhookStatus = async (id: string, status: "ACTIVE" | "DISABLED") => {
        if (!accessToken) return;
        try {
            await api.developer.patchWebhookEndpointStatus(id, { status }, accessToken);
            await loadWebhooks();
        } catch (err) {
            console.error(err);
            if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        if (!accessToken) return;
        try {
            await api.developer.deleteWebhookEndpoint(id, accessToken);
            await loadWebhooks();
        } catch (err) {
            console.error(err);
            if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
        }
    };

    const handleRedeliver = async (id: string) => {
        if (!accessToken) return;
        try {
            await api.developer.redeliverWebhookDelivery(id, accessToken);
            await loadDeliveries();
        } catch (err) {
            console.error(err);
            if (err instanceof ApiError && err.status === 401 && err.code !== "MISSING_ACCESS_TOKEN") {
                signIn();
            }
        }
    };

    /* Applications → Sandbox → Explorer → Production Access → Webhooks (sandbox) → Deliveries */
    const tabItems = [
        {
            key: "applications",
            label: t("applications.tab"),
            children: accessToken ? (
                <ApplicationsPanel
                    accessToken={accessToken}
                    onStartVerification={async (credentials) => {
                        await createSandboxSession({
                            clientId: credentials.clientId,
                            clientSecret: credentials.clientSecret,
                        });
                        setSandboxRefreshKey((value) => value + 1);
                        setActiveTab("sandbox");
                    }}
                />
            ) : null,
        },
        {
            key: "sandbox",
            label: t("sandbox.tab"),
            children: (
                <IntegrationSandboxPanel
                    accessToken={accessToken}
                    refreshKey={sandboxRefreshKey}
                    onNeedCredentials={() => setActiveTab("applications")}
                />
            ),
        },
        {
            key: "explorer",
            label: t("explorer.tab"),
            children: accessToken ? <ExplorerPanel accessToken={accessToken} /> : null,
        },
        {
            key: "production",
            label: t("productionAccess.tab"),
            children: accessToken ? (
                <ProductionAccessPanel
                    accessToken={accessToken}
                    active={activeTab === "production"}
                />
            ) : null,
        },
        {
            key: "webhooks",
            label: t("webhook_endpoints"),
            children: accessToken ? (
                <WebhookPanel
                    webhooks={webhooks}
                    loading={loading}
                    error={webhooksError}
                    submitting={submitting}
                    createdWebhook={
                        createdWebhook?.environment === "SANDBOX" ? createdWebhook : null
                    }
                    environmentScope="SANDBOX"
                    onCreate={handleCreateWebhook}
                    onPatchStatus={handlePatchWebhookStatus}
                    onDelete={handleDeleteWebhook}
                    onRetry={loadWebhooks}
                    onDismissCreated={() => setCreatedWebhook(null)}
                />
            ) : null,
        },
        {
            key: "deliveries",
            label: t("webhook_deliveries"),
            children: accessToken ? (
                <WebhookDeliveriesPanel
                    deliveries={webhookDeliveries}
                    loading={deliveriesLoading}
                    error={deliveriesError}
                    onRedeliver={handleRedeliver}
                    onRetry={loadDeliveries}
                />
            ) : null,
        },
    ];

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")} contentMode="table" plain>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                size="large"
                style={{ marginBottom: 4 }}
            />
        </DashboardPage>
    );
}
