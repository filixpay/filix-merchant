/** Select sentinel — UI value when no single asset is filtered. */
export const MONEY_ASSET_FILTER_ALL = "__ALL__";

/** Keep explicit asset selection; otherwise default to all assets. */
export function normalizeAssetFilterOnOptionsLoad(
  prev: string | null,
  codes: string[],
): string | null {
  if (prev !== null && codes.includes(prev)) {
    return prev;
  }
  return null;
}

export function assetCodeForQuery(selected: string | null): string | undefined {
  return selected ?? undefined;
}

export function buildAssetFilterSelectOptions(
  codes: string[],
  allLabel: string,
): { value: string; label: string }[] {
  return [
    { value: MONEY_ASSET_FILTER_ALL, label: allLabel },
    ...codes.map((code) => ({ value: code, label: code })),
  ];
}

export function selectValueFromAssetFilter(selected: string | null): string {
  return selected ?? MONEY_ASSET_FILTER_ALL;
}

export function assetFilterFromSelectValue(value: string): string | null {
  return value === MONEY_ASSET_FILTER_ALL ? null : value;
}
