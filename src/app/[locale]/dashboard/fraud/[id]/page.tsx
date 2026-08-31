"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import FraudDetailView from "@/components/fraud/FraudDetailView";

export default function FraudDetailPage() {
    const params = useParams<{ id: string }>();
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [event, setEvent] = useState<Awaited<ReturnType<typeof api.risk.fraud.get>> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEvent = useCallback(async () => {
        if (!accessToken || !params.id) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            setEvent(await api.risk.fraud.get(params.id, accessToken));
        } catch (err) {
            setError(err instanceof Error ? err.message : tCommon("error"));
            setEvent(null);
        } finally {
            setLoading(false);
        }
    }, [accessToken, params.id, tCommon]);

    useEffect(() => {
        loadEvent();
    }, [loadEvent]);

    return <FraudDetailView event={event} loading={loading} error={error} />;
}
