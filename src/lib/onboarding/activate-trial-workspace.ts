import type { OrganizationMerchantView, OrganizationSummaryView } from "@/lib/api";

export type ActivateTrialWorkspaceDeps = {
  listOrganizations: (token: string) => Promise<OrganizationSummaryView[]>;
  listMerchants: (token: string) => Promise<OrganizationMerchantView[]>;
  persistOrganization: (org: OrganizationSummaryView) => void;
  persistMerchantCode: (code: string | number) => void;
  writeCache: (orgs: OrganizationSummaryView[]) => void;
};

export async function activateTrialWorkspace(
  token: string,
  preferredMerchantCode: string | number | undefined,
  deps: ActivateTrialWorkspaceDeps,
): Promise<{ organizationCode: string; merchantCode: string }> {
  const orgs = await deps.listOrganizations(token);
  if (!orgs.length) {
    throw new Error("MEMBERSHIP_NOT_READY");
  }
  deps.writeCache(orgs);
  const org = orgs[0];
  deps.persistOrganization(org);

  const merchants = await deps.listMerchants(token);
  if (!merchants.length) {
    throw new Error("MERCHANT_NOT_READY");
  }
  const preferred = preferredMerchantCode != null ? String(preferredMerchantCode) : null;
  const match =
    (preferred && merchants.find((m) => String(m.merchantCode) === preferred)) || merchants[0];
  deps.persistMerchantCode(match.merchantCode);
  return {
    organizationCode: String(org.code),
    merchantCode: String(match.merchantCode),
  };
}
