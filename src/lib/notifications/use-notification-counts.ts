"use client";

import { useEffect, useState } from "react";
import { api, type NotificationCounts } from "@/lib/api";
import { invalidateNotificationState, subscribeNotificationInvalidation, subscribeNotificationVisibilityRefresh } from "./invalidate";
import { useSelectedOrganizationCode } from "@/lib/organization/use-selected-organization-code";

const EMPTY_COUNTS: NotificationCounts = {
    unreadNotifications: 0,
    openTasks: 0,
};

export function useNotificationCounts(accessToken: string | undefined) {
    const organizationCode = useSelectedOrganizationCode();
    const [counts, setCounts] = useState<NotificationCounts>(EMPTY_COUNTS);
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
                const response = await api.notifications.getCounts(accessToken);
                if (!cancelled) {
                    setCounts(response);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err);
                    setCounts(EMPTY_COUNTS);
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
    }, [accessToken, organizationCode, refreshKey]);

    return { counts, loading, error };
}

export { invalidateNotificationState };
