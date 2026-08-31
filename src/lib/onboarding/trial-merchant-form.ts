export type TrialMerchantSettlementMode = "PLATFORM" | "DIRECT";

export type TrialMerchantFormValues = {
  name: string;
  mobile: string;
  /** International dialing code, e.g. +86. Defaults to +86 when omitted. */
  phonePrefix?: string;
  officialIdNumber: string;
  settlementMode: TrialMerchantSettlementMode;
  settlementCurrency: string;
};

const PHONE_DIGITS_RE = /^\d{5,20}$/;
const PREFIX_RE = /^\+\d{1,4}$/;

export function normalizePhonePrefix(prefix: string | undefined): string {
  const raw = (prefix ?? "+86").trim() || "+86";
  return raw.startsWith("+") ? raw : `+${raw.replace(/^\+/, "")}`;
}

export function composeTrialMobile(prefix: string | undefined, local: string): string {
  const digits = local.replace(/\D/g, "");
  const code = normalizePhonePrefix(prefix);
  if (code === "+86") {
    return digits;
  }
  return `${code} ${digits}`.trim();
}

export function validateTrialMerchantForm(
  values: TrialMerchantFormValues,
): Partial<Record<keyof TrialMerchantFormValues, string>> {
  const errors: Partial<Record<keyof TrialMerchantFormValues, string>> = {};
  if (!values.name?.trim()) errors.name = "errors.nameRequired";

  const prefix = normalizePhonePrefix(values.phonePrefix);
  if (!PREFIX_RE.test(prefix)) {
    errors.mobile = "errors.phonePrefixInvalid";
  } else {
    const local = (values.mobile ?? "").replace(/\D/g, "");
    if (!PHONE_DIGITS_RE.test(local)) {
      errors.mobile = "errors.mobileInvalid";
    }
  }

  const id = values.officialIdNumber?.trim() ?? "";
  if (id.length < 15 || id.length > 18) errors.officialIdNumber = "errors.officialIdInvalid";
  if (!values.settlementMode) {
    errors.settlementMode = "errors.settlementModeRequired";
  }
  if (!values.settlementCurrency?.trim()) {
    errors.settlementCurrency = "errors.settlementCurrencyRequired";
  }
  return errors;
}

export function mapTrialCreateError(err: {
  status: number;
  code?: number | string;
  message: string;
  data?: unknown;
}): {
  kind: "field" | "banner" | "already_has_merchant" | "unauthorized";
  field?: keyof TrialMerchantFormValues;
  messageKey: string;
} {
  if (err.status === 401) {
    return { kind: "unauthorized", messageKey: "errors.unauthorized" };
  }
  const code = String(err.code ?? "");
  if (code === "DUPLICATE_NAME") {
    return { kind: "field", field: "name", messageKey: "errors.duplicateName" };
  }
  if (code === "MERCHANT_ACCESS_EXISTS") {
    return { kind: "already_has_merchant", messageKey: "errors.alreadyHasMerchant" };
  }
  if (
    code === "ORGANIZATION_ALREADY_EXISTS" ||
    (err.status === 409 &&
      err.data &&
      typeof err.data === "object" &&
      err.data !== null &&
      "organizationCode" in err.data)
  ) {
    return { kind: "banner", messageKey: "errors.registrationTaken" };
  }
  return { kind: "banner", messageKey: "errors.createFailed" };
}
