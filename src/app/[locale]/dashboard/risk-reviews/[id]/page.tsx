"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import RiskReviewDetailView from "@/components/risk-reviews/RiskReviewDetailView";

export default function RiskReviewDetailPage() {
    const params = useParams<{ id: string }>();
    const tCommon = useTranslations("Common");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [review, setReview] = useState<Awaited<ReturnType<typeof api.risk.reviews.get>> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadReview = useCallback(async () => {
        if (!accessToken || !params.id) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            setReview(await api.risk.reviews.get(params.id, accessToken));
        } catch (err) {
            setError(err instanceof Error ? err.message : tCommon("error"));
            setReview(null);
        } finally {
            setLoading(false);
        }
    }, [accessToken, params.id, tCommon]);

    useEffect(() => {
        loadReview();
    }, [loadReview]);

    return <RiskReviewDetailView review={review} loading={loading} error={error} />;
}
