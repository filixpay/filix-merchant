"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
    getActivationStatus,
    markCelebrationSeen as postCelebrationSeen,
    type CommerceActivationStatus,
} from "@/lib/api/domains/commerce/activation";
import {
    ACTIVATION_POLL_INTERVAL_MS,
    decideActivationPoll,
} from "@/lib/commerce/activation-polling";

export type { CommerceActivationPhase, CommerceActivationStatus } from "@/lib/api/domains/commerce/activation";

export function useCommerceActivation(): {
    status: CommerceActivationStatus | undefined;
    isLoading: boolean;
    error: Error | null;
    pollingTimedOut: boolean;
    refetch: () => void;
    markCelebrationSeen: () => Promise<void>;
} {
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const [status, setStatus] = useState<CommerceActivationStatus | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [pollingTimedOut, setPollingTimedOut] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const pollStartedAtRef = useRef<number | null>(null);
    const statusRef = useRef(status);
    statusRef.current = status;

    const refetch = useCallback(() => {
        setPollingTimedOut(false);
        pollStartedAtRef.current = null;
        setRefreshKey((key) => key + 1);
    }, []);

    const fetchStatus = useCallback(async () => {
        if (!accessToken) {
            setStatus(undefined);
            setError(null);
            setIsLoading(false);
            return;
        }

        try {
            const next = await getActivationStatus(accessToken);
            setStatus(next);
            setError(null);
            if (next.phase !== "PUBLISHING") {
                setPollingTimedOut(false);
                pollStartedAtRef.current = null;
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        setIsLoading(true);
        void fetchStatus();
    }, [fetchStatus, refreshKey]);

    useEffect(() => {
        if (!accessToken || status?.phase !== "PUBLISHING" || pollingTimedOut) {
            return;
        }

        if (pollStartedAtRef.current === null) {
            pollStartedAtRef.current = Date.now();
        }

        const timer = window.setInterval(() => {
            const startedAt = pollStartedAtRef.current ?? Date.now();
            const elapsedMs = Date.now() - startedAt;
            const decision = decideActivationPoll(statusRef.current?.phase, elapsedMs);

            if (decision.action === "timeout") {
                setPollingTimedOut(true);
                window.clearInterval(timer);
                return;
            }
            if (decision.action === "stop") {
                window.clearInterval(timer);
                return;
            }

            void fetchStatus();
        }, ACTIVATION_POLL_INTERVAL_MS);

        return () => window.clearInterval(timer);
    }, [accessToken, status?.phase, pollingTimedOut, fetchStatus]);

    const markCelebrationSeen = useCallback(async () => {
        if (!accessToken) {
            return;
        }
        await postCelebrationSeen(accessToken);
    }, [accessToken]);

    return {
        status,
        isLoading,
        error,
        pollingTimedOut,
        refetch,
        markCelebrationSeen,
    };
}
