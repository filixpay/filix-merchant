/** Merchant tier values from GET /portal/merchant (Jackson enum name). */
export type MerchantTierValue =
    | "PREMIUM"
    | "STANDARD"
    | "BASIC"
    | "TRIAL"
    | "TRIAL_EXPIRED"
    | string;

type MerchantTierSource = {
    merchantTier?: MerchantTierValue | { name?: string } | null;
};

/** Normalize API tier (string or enum-shaped object) to a name. */
export function resolveMerchantTier(merchant?: MerchantTierSource | null): string | undefined {
    const raw = merchant?.merchantTier;
    if (raw == null || raw === "") {
        return undefined;
    }
    if (typeof raw === "string") {
        return raw;
    }
    if (typeof raw === "object" && raw.name) {
        return String(raw.name);
    }
    return String(raw);
}

/** Trial or trial-expired — show formal onboarding entry. */
export function isTrialMerchant(merchant?: MerchantTierSource | null): boolean {
    const tier = resolveMerchantTier(merchant);
    return tier === "TRIAL" || tier === "TRIAL_EXPIRED";
}

/** Active trial that can submit an UPGRADE application. */
export function canUpgradeToFormal(merchant?: MerchantTierSource | null): boolean {
    return resolveMerchantTier(merchant) === "TRIAL";
}
