/** Locale-aware path for Money ExternalAccount management. */
export function moneyExternalAccountsPath(locale: string): string {
  return `/${locale}/dashboard/money/external-accounts`;
}

/** Hard-cut redirect target from legacy portal bank accounts. */
export function legacyBankAccountsRedirectPath(locale: string): string {
  return moneyExternalAccountsPath(locale);
}
