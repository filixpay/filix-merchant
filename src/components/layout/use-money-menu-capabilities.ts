"use client";

import { useQuery } from "@tanstack/react-query";
import { moneyProductApi, type MoneyAssetCapability, type MoneyGate } from "@/lib/api";
import { shellQueryKeys } from "@/lib/query/keys";

const DEFAULT_ASSET = "CNY";

type MoneyMenuCapabilityApi = Pick<typeof moneyProductApi, "getGate" | "getAssetCapability">;

/**
 * Loads Money gate + optional asset capability.
 * Gate success is preserved even when capability fetch fails so Balance/Activity stay visible.
 */
export async function loadMoneyMenuCapabilities(
    accessToken: string,
    api: MoneyMenuCapabilityApi = moneyProductApi,
): Promise<{ gate: MoneyGate | null; capability: MoneyAssetCapability | null }> {
    let nextGate: MoneyGate;
    try {
        nextGate = await api.getGate(accessToken);
    } catch (err) {
        console.error("Failed to load Money gate:", err);
        return { gate: null, capability: null };
    }

    if (!(nextGate.canView && nextGate.moneyEnabled)) {
        return { gate: nextGate, capability: null };
    }

    try {
        const nextCapability = await api.getAssetCapability(accessToken, DEFAULT_ASSET);
        return { gate: nextGate, capability: nextCapability };
    } catch (err) {
        console.error("Failed to load Money asset capability:", err);
        return { gate: nextGate, capability: null };
    }
}

/**
 * Loads Money gate + asset capability for dashboard menu visibility.
 * Capability is fetched only when the Money module is gated on.
 */
export function useMoneyMenuCapabilities(accessToken: string | undefined) {
    const query = useQuery({
        queryKey: shellQueryKeys.moneyMenu(),
        queryFn: () => loadMoneyMenuCapabilities(accessToken!),
        enabled: Boolean(accessToken),
    });

    return {
        gate: query.data?.gate ?? null,
        capability: query.data?.capability ?? null,
    };
}
