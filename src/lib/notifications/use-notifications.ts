"use client";

import { useEffect, useState } from "react";
import { api, type MerchantNotification } from "@/lib/api";
import { subscribeNotificationInvalidation, subscribeNotificationVisibilityRefresh } from "./invalidate";
import { useSelectedOrganizationCode } from "@/lib/organization/use-selected-organization-code";

export function useNotifications(
    accessToken: string | undefined,
    options: { page?: number; size?: number; unread?: boolean } = {},
) {
    const page = options.page ?? 0;
    const size = options.size ?? 20;
    const unread = options.unread;
    const organizationCode = useSelectedOrganizationCode();

    const [items, setItems] = useState<MerchantNotification[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const bump = () => setRefreshKey((key) => key + 1);
        const unsubscribeInvalidation = subscribeNotificationInvalidation(bump);
        const unsubscribeVisibility = subscribeNotificationVisibilityRefresh(bump);
        return () => {
            unsubscribeInvalidation();
            unsubscribeVisibility();
        };
    }, []);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        if (!organizationCode) {
            setLoading(true);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        void (async () => {
            try {
                const response = await api.notifications.list(accessToken, { page, size, unread });
                if (!cancelled) {
                    setItems(response.items);
                    setTotal(response.total);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err);
                    setItems([]);
                    setTotal(0);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [accessToken, organizationCode, page, size, unread, refreshKey]);

    return { items, total, loading, error };
}
