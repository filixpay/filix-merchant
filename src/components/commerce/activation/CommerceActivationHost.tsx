"use client";

import { useCommerceActivation } from "@/hooks/useCommerceActivation";
import CommerceActivationCard from "./CommerceActivationCard";
import FirstPublishCelebrationModal from "./FirstPublishCelebrationModal";

export default function CommerceActivationHost() {
    const { status, isLoading, error, pollingTimedOut, refetch, markCelebrationSeen } =
        useCommerceActivation();

    if (isLoading || error || !status) {
        return null;
    }

    return (
        <>
            <CommerceActivationCard
                status={status}
                pollingTimedOut={pollingTimedOut}
                onRefresh={refetch}
            />
            <FirstPublishCelebrationModal
                open={status.shouldShowFirstPublishCelebration}
                productName={status.activationProductName}
                storefrontPreviewUrl={status.storefrontPreviewUrl}
                markCelebrationSeen={markCelebrationSeen}
            />
        </>
    );
}
