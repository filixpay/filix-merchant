"use client";

import { useCommerceActivation } from "@/hooks/useCommerceActivation";
import CommerceActivationCard from "./CommerceActivationCard";

/**
 * Dashboard host for activation card. Modal is wired in a follow-up.
 */
export default function CommerceActivationHost() {
    const { status, isLoading, error, pollingTimedOut, refetch } = useCommerceActivation();

    if (isLoading || error || !status) {
        return null;
    }

    return (
        <CommerceActivationCard
            status={status}
            pollingTimedOut={pollingTimedOut}
            onRefresh={refetch}
        />
    );
}
