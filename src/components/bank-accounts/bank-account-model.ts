export function getBankAccountStatusColor(
  status: string,
): "success" | "default" | "error" {
  if (status === "ACTIVE") return "success";
  if (status === "INACTIVE") return "default";
  return "error";
}

export function getBankAccountStatusLabel(
  status: string,
  translate?: (key: "ACTIVE" | "INACTIVE") => string,
): string {
  if (status === "ACTIVE" || status === "INACTIVE") {
    return translate?.(status) ?? status;
  }
  return status;
}

export function formatBankAccountDateTime(value?: string): string {
  return value ? new Date(value).toLocaleString() : "—";
}

/** Resolve account number across API field aliases. */
export function resolveBankAccountNumber(account: {
  bankAccountNumber?: string | null;
  accountNumber?: string | null;
  bankAccountNo?: string | null;
}): string {
  return (
    account.bankAccountNumber?.trim() ||
    account.accountNumber?.trim() ||
    account.bankAccountNo?.trim() ||
    ""
  );
}

/** Display mask — prefers full number when present, else accountLast4 from encrypted list payloads. */
export function resolveBankAccountDisplayMask(account: {
  bankAccountNumber?: string | null;
  accountNumber?: string | null;
  bankAccountNo?: string | null;
  accountLast4?: string | null;
}): string {
  const full = resolveBankAccountNumber(account);
  if (full) return maskBankAccountNumber(full);
  const last4 = account.accountLast4?.trim();
  if (last4) return `****${last4}`;
  return "—";
}

/**
 * Mask for list display: keep first/last 4 digits, mono-friendly separators.
 * e.g. 88888999900006666 → 8888 •••• •••• 6666
 */
export function maskBankAccountNumber(value: string | null | undefined): string {
  const digits = (value ?? "").replace(/\s+/g, "");
  if (!digits) return "—";
  if (digits.length <= 8) return digits;
  return `${digits.slice(0, 4)} •••• •••• ${digits.slice(-4)}`;
}

export const COMMON_BANK_NAMES = [
  "中国工商银行",
  "中国建设银行",
  "中国农业银行",
  "中国银行",
  "交通银行",
  "招商银行",
  "浦发银行",
  "中信银行",
  "中国光大银行",
  "兴业银行",
  "民生银行",
  "平安银行",
  "华夏银行",
  "广发银行",
  "北京银行",
  "上海银行",
] as const;

export const COMMON_CITIES = [
  "北京市",
  "上海市",
  "广州市",
  "深圳市",
  "杭州市",
  "成都市",
  "重庆市",
  "武汉市",
  "南京市",
  "苏州市",
  "天津市",
  "西安市",
  "长沙市",
  "郑州市",
  "青岛市",
  "宁波市",
] as const;
