export type MerchantMembershipState = "NO_MERCHANT" | "HAS_MERCHANT";
export type PortalIntent = "merchant" | "enterprise";

export function membershipStateFromOrganizations(
  organizations: ReadonlyArray<{ code: string | number }>,
): MerchantMembershipState {
  return organizations.length === 0 ? "NO_MERCHANT" : "HAS_MERCHANT";
}

export function resolvePostAuthPath(input: {
  locale: string;
  portalIntent: PortalIntent;
  membership: MerchantMembershipState;
}): string {
  if (input.portalIntent === "enterprise") {
    return `/${input.locale}/enterprise/dashboard`;
  }
  if (input.membership === "NO_MERCHANT") {
    return `/${input.locale}/onboarding/create-merchant`;
  }
  return `/${input.locale}/dashboard`;
}

export function shouldRedirectDashboardToCreateMerchant(
  membership: MerchantMembershipState,
  organizationsLoading: boolean,
): boolean {
  return !organizationsLoading && membership === "NO_MERCHANT";
}

export function shouldRedirectCreateMerchantToDashboard(
  membership: MerchantMembershipState,
  organizationsLoading: boolean,
): boolean {
  return !organizationsLoading && membership === "HAS_MERCHANT";
}
