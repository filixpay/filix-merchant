"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type OrganizationMerchantView, type OrganizationSummaryView } from "@/lib/api";
import { clearStoredSelectedMerchantCode } from "@/lib/merchant/selected-merchant-code";
import { shellQueryKeys } from "@/lib/query/keys";
import {
    isMerchantScopeDeniedError,
    notifyMerchantScopeDenied,
    subscribeMerchantScopeDenied,
} from "@/lib/organization/merchant-scope-denied";
import { organizationCodeToString } from "./organization-shell";
import {
    clearOrganizationMerchantsCache,
    findSelectedOrganizationMerchant,
    getInitialActiveOrganizationMerchant,
    getStoredSelectedMerchantCode,
    persistOrganizationMerchantSelection,
    readOrganizationMerchantsCache,
    writeOrganizationMerchantsCache,
} from "./organization-merchant-shell";

export function useOrganizationMerchants(
    accessToken: string | undefined,
    activeOrganization: OrganizationSummaryView | null,
) {
    const queryClient = useQueryClient();
    const organizationCode = activeOrganization
        ? organizationCodeToString(activeOrganization.code)
        : null;

    const cached = organizationCode
        ? readOrganizationMerchantsCache(organizationCode)
        : null;

    const query = useQuery({
        queryKey: organizationCode
            ? shellQueryKeys.organizationMerchants(organizationCode)
            : ["shell", "organization-merchants", "disabled"],
        queryFn: async () => {
            const data = await api.organizations.listMerchants(accessToken!);
            writeOrganizationMerchantsCache(organizationCode!, data);
            return data;
        },
        enabled: Boolean(accessToken && organizationCode),
        placeholderData: cached ?? undefined,
    });

    const merchants = organizationCode ? (query.data ?? cached ?? []) : [];

    const [activeMerchant, setActiveMerchant] = useState<OrganizationMerchantView | null>(() => {
        const initial = getInitialActiveOrganizationMerchant(organizationCode);
        if (initial) {
            persistOrganizationMerchantSelection(initial);
        }
        return initial;
    });
    const [merchantScopeDenied, setMerchantScopeDenied] = useState(false);

    const applyMerchantList = useCallback(
        (data: OrganizationMerchantView[], afterScopeDenied = false) => {
            if (!organizationCode) {
                setActiveMerchant(null);
                return;
            }
            writeOrganizationMerchantsCache(organizationCode, data);
            const selected = afterScopeDenied
                ? data[0] ?? null
                : findSelectedOrganizationMerchant(data, getStoredSelectedMerchantCode());
            if (selected) {
                persistOrganizationMerchantSelection(selected);
                setActiveMerchant(selected);
            } else {
                clearStoredSelectedMerchantCode();
                setActiveMerchant(null);
            }
        },
        [organizationCode],
    );

    useEffect(() => {
        if (!organizationCode) {
            setActiveMerchant(null);
            return;
        }
        if (!query.data) return;
        applyMerchantList(query.data);
    }, [applyMerchantList, organizationCode, query.data]);

    const recoverFromScopeDenied = useCallback(async () => {
        if (!accessToken || !organizationCode) {
            return;
        }
        clearStoredSelectedMerchantCode();
        setMerchantScopeDenied(true);
        try {
            const data = await api.organizations.listMerchants(accessToken);
            queryClient.setQueryData(
                shellQueryKeys.organizationMerchants(organizationCode),
                data,
            );
            applyMerchantList(data, true);
        } catch (err) {
            console.error("Failed to recover from merchant scope denial:", err);
            clearOrganizationMerchantsCache();
            setActiveMerchant(null);
        }
    }, [accessToken, applyMerchantList, organizationCode, queryClient]);

    useEffect(() => {
        return subscribeMerchantScopeDenied(() => {
            void recoverFromScopeDenied();
        });
    }, [recoverFromScopeDenied]);

    useEffect(() => {
        if (query.error && isMerchantScopeDeniedError(query.error)) {
            void recoverFromScopeDenied();
            notifyMerchantScopeDenied();
        }
    }, [query.error, recoverFromScopeDenied]);

    const reloadMerchants = useCallback(async () => {
        if (!accessToken || !organizationCode) {
            clearOrganizationMerchantsCache();
            setActiveMerchant(null);
            return;
        }
        await queryClient.invalidateQueries({
            queryKey: shellQueryKeys.organizationMerchants(organizationCode),
        });
    }, [accessToken, organizationCode, queryClient]);

    const selectMerchant = useCallback((merchant: OrganizationMerchantView) => {
        persistOrganizationMerchantSelection(merchant);
        setActiveMerchant(merchant);
        setMerchantScopeDenied(false);
    }, []);

    const acknowledgeMerchantScopeDenied = useCallback(() => {
        setMerchantScopeDenied(false);
    }, []);

    return {
        merchants,
        merchantsLoading:
            Boolean(organizationCode) &&
            merchants.length === 0 &&
            (query.isPending || query.isFetching),
        activeMerchant,
        merchantScopeDenied,
        reloadMerchants,
        selectMerchant,
        acknowledgeMerchantScopeDenied,
    };
}

export { isMerchantScopeDeniedError, notifyMerchantScopeDenied };
