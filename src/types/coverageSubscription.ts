export type MerchantCoverageSubscriptionStatus =
    | "PENDING"
    | "SUBSCRIBED"
    | "SUSPENDED"
    | "UNSUBSCRIBED";

export interface CoverageSubscriptionView {
    publicId: string;
    merchantCode: number;
    status: MerchantCoverageSubscriptionStatus;
    subscribedAt?: string | null;
    unsubscribedAt?: string | null;
    agreementVersion: string;
    providerType?: string | null;
    providerConfigVersion?: number | null;
    source: string;
}

export interface CoverageSubscriptionSubscribeRequest {
    agreementVersion?: string;
}
