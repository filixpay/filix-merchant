export const shellQueryKeys = {
  organizations: () => ["shell", "organizations"] as const,
  organizationMerchants: (organizationCode: string) =>
    ["shell", "organization-merchants", organizationCode] as const,
  merchants: () => ["shell", "merchants"] as const,
  merchantDetail: (businessAccountCode: string | null | undefined) =>
    ["shell", "merchant-detail", businessAccountCode ?? ""] as const,
  enterprises: () => ["shell", "enterprises"] as const,
  moneyMenu: () => ["shell", "money-menu"] as const,
};
