"use client";

import { useEffect, useMemo, useState } from "react";
import { api, type ActionTaskView } from "@/lib/api";
import { buildTaskSummary, type TaskSummary } from "./task-summary";
import { subscribeNotificationInvalidation, subscribeNotificationVisibilityRefresh } from "./invalidate";
import { useSelectedOrganizationCode } from "@/lib/organization/use-selected-organization-code";

const EMPTY_SUMMARY: TaskSummary = {
    openTasks: 0,
    overdue: 0,
    dueSoon: 0,
    actionRequired: 0,
    topTask: null,
};

export function useOpenTasks(accessToken: string | undefined, size = 100) {
    const organizationCode = useSelectedOrganizationCode();
    const [tasks, setTasks] = useState<ActionTaskView[]>([]);
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
        // Wait for Org selection — avoids ORGANIZATION_CODE_REQUIRED race on cold load.
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
                const response = await api.notifications.listTasks(accessToken, {
                    page: 0,
                    size,
                    status: "OPEN",
                });
                if (!cancelled) {
                    setTasks(response.items);
                    setTotal(response.total);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err);
                    setTasks([]);
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
    }, [accessToken, organizationCode, refreshKey, size]);

    const summary = useMemo(
        () => (tasks.length > 0 || total > 0 ? buildTaskSummary(tasks, total) : EMPTY_SUMMARY),
        [tasks, total],
    );

    return { tasks, total, summary, loading, error };
}
