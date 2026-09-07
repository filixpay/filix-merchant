export const MERCHANT_AGREEMENT_VERSION = "V1.0.0" as const;

export type MerchantAgreementType =
  | "MERCHANT_SERVICE_AGREEMENT"
  | "MERCHANT_FEE_RULES";

export type AgreementAcceptancePayload = {
  agreementType: MerchantAgreementType;
  agreementVersion: typeof MERCHANT_AGREEMENT_VERSION;
};

/** Required acceptances for formal onboarding submit (V1). */
export const REQUIRED_ONBOARDING_ACCEPTANCES: AgreementAcceptancePayload[] = [
  {
    agreementType: "MERCHANT_SERVICE_AGREEMENT",
    agreementVersion: MERCHANT_AGREEMENT_VERSION,
  },
  {
    agreementType: "MERCHANT_FEE_RULES",
    agreementVersion: MERCHANT_AGREEMENT_VERSION,
  },
];
