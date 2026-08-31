import type { MerchantDetailView } from "@/lib/api";

export type MerchantCoverageAccess = {
    isPlatform: boolean;
    isPlatformManaged: boolean;
    showCoverageConfig: boolean;
    showCoverageInsurance: boolean;
};

export function resolveMerchantCoverageAccess(
    merchantDetail: MerchantDetailView | null,
): MerchantCoverageAccess {
    const isPlatformSettlement = merchantDetail?.settlementMode === "PLATFORM";
    const isDirectSettlement = merchantDetail?.settlementMode === "DIRECT";
    const isPlatform = merchantDetail?.merchantType === "PLATFORM";
    const isPlatformManaged = isPlatformSettlement && !isPlatform;

    return {
        isPlatform,
        isPlatformManaged,
        showCoverageConfig: isDirectSettlement || isPlatform,
        showCoverageInsurance: isPlatformManaged,
    };
}
