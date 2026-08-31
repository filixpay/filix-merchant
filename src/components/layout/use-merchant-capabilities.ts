"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, MerchantDetailView } from "@/lib/api";
import { shellQueryKeys } from "@/lib/query/keys";
import {
    isMerchantScopeDeniedError,
    notifyMerchantScopeDenied,
} from "@/lib/organization/merchant-scope-denied";
import {
    findSelectedMerchant,
    getInitialActiveMerchant,
    getStoredSelectedMerchantId,
    persistMerchantSelection,
    readMerchantsCache,
    writeMerchantsCache,
} from "./merchant-shell";

/**
 * @param businessAccountCode — when set (from Org business-account switcher),
 *   reloads `/portal/merchant` detail under the new `X-Merchant-Code`.
 */
export function useMerchantCapabilities(
    accessToken: string | undefined,
    businessAccountCode?: string | null,
) {
    const queryClient = useQueryClient();
    const cached = readMerchantsCache();

    const listQuery = useQuery({
        queryKey: shellQueryKeys.merchants(),
        queryFn: async () => {
            const data = await api.merchants.list(accessToken!);
            writeMerchantsCache(data);
            return data;
        },
        enabled: Boolean(accessToken),
        placeholderData: cached ?? undefined,
    });

    const merchants = listQuery.data ?? cached ?? [];

    const [activeMerchant, setActiveMerchant] = useState<MerchantDetailView | null>(
        getInitialActiveMerchant,
    );

    useEffect(() => {
        if (!listQuery.data) return;
        const selected = findSelectedMerchant(listQuery.data, getStoredSelectedMerchantId());
        if (selected) {
            persistMerchantSelection(selected);
            setActiveMerchant(selected);
        }
    }, [listQuery.data]);

    const detailQuery = useQuery({
        queryKey: shellQueryKeys.merchantDetail(businessAccountCode),
        queryFn: async () => {
            try {
                const detail = await api.merchants.getDetail(accessToken!);
                persistMerchantSelection(detail);
                return detail;
            } catch (err) {
                if (isMerchantScopeDeniedError(err)) {
                    notifyMerchantScopeDenied();
                    return null;
                }
                throw err;
            }
        },
        enabled: Boolean(accessToken),
    });

    useEffect(() => {
        if (detailQuery.data === undefined) return;
        if (detailQuery.data === null) {
            setActiveMerchant(null);
            return;
        }
        setActiveMerchant(detailQuery.data);
    }, [detailQuery.data]);

    const reloadMerchants = useCallback(async () => {
        if (!accessToken) return;
        await queryClient.invalidateQueries({
            queryKey: shellQueryKeys.merchants(),
        });
    }, [accessToken, queryClient]);

    const reloadActiveDetail = useCallback(async () => {
        if (!accessToken) return;
        await queryClient.invalidateQueries({
            queryKey: shellQueryKeys.merchantDetail(businessAccountCode),
        });
    }, [accessToken, businessAccountCode, queryClient]);

    const selectMerchant = useCallback((merchant: MerchantDetailView) => {
        persistMerchantSelection(merchant);
        setActiveMerchant(merchant);
    }, []);

    return {
        merchants,
        merchantsLoading: listQuery.isLoading && merchants.length === 0,
        activeMerchant,
        reloadMerchants,
        reloadActiveDetail,
        selectMerchant,
    };
}
