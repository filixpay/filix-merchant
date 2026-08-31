"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { api, type RiskRuleView } from "@/lib/api";
import DashboardPage from "@/components/layout/DashboardPage";
import RiskRuleTable from "@/components/risk/RiskRuleTable";
import { handleDashboardApiError } from "@/lib/dashboard/handle-dashboard-api-error";

const PRE_AUTH_STAGE = "PRE_AUTH";

export default function RiskRulesPage() {
    const t = useTranslations("RiskRules");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const [rules, setRules] = useState<RiskRuleView[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<unknown | null>(null);
    const rulesRef = useRef(rules);
    rulesRef.current = rules;

    const reload = useCallback(async () => {
        if (!accessToken) {
            setLoading(false);
            setIsRefreshing(false);
            setError(null);
            return;
        }

        const hasExistingRows = rulesRef.current.length > 0;
        setLoading(!hasExistingRows);
        setIsRefreshing(hasExistingRows);
        setError(null);
        try {
            const items = await api.risk.rules.list(accessToken, PRE_AUTH_STAGE);
            setRules(items);
        } catch (err) {
            const handled = handleDashboardApiError(err);
            if (!handled) {
                setError(err);
            }
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        void reload();
    }, [accessToken, reload]);

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")}>
            <RiskRuleTable
                rules={rules}
                loading={loading}
                isRefreshing={isRefreshing}
                error={error}
                onRetry={reload}
            />
        </DashboardPage>
    );
}
