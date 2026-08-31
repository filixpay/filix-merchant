/**
 * Shared Money product UI label resolver (display only).
 */
export function presentMoneyI18nLabel(
  t: (key: string) => string,
  has: (key: string) => boolean,
  namespace: string,
  raw: string,
  unknownKey = "UNKNOWN",
): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) {
    return has(`${namespace}.${unknownKey}`) ? t(`${namespace}.${unknownKey}`) : "-";
  }
  const key = `${namespace}.${trimmed}`;
  if (has(key)) {
    return t(key);
  }
  return trimmed;
}
