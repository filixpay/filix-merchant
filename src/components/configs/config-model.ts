import type {
    PaymentConfigUpdateRequest,
    PaymentConfigView,
    FinancialInstitutionView,
    ChannelView,
    ScenarioView,
} from "@/lib/api";

export function getConfigStatusColor(config: PaymentConfigView): string {
    switch (config.openStatus) {
        case "OPENED":
            return "success";
        case "APPLYING":
            return "processing";
        case "REJECTED":
        case "FORBIDDEN":
            return "error";
        case "NONACTIVEED":
            return "default";
        default:
            return config.active ? "success" : "default";
    }
}

export type ConfigStatusLabelKey =
    | "status_open"
    | "status_close"
    | "status_applying"
    | "status_rejected"
    | "status_forbidden";

export function getConfigStatusLabel(
    config: PaymentConfigView,
    translate?: (key: ConfigStatusLabelKey) => string,
): string {
    switch (config.openStatus) {
        case "OPENED":
            return translate?.("status_open") ?? "OPENED";
        case "NONACTIVEED":
            return translate?.("status_close") ?? "NONACTIVEED";
        case "APPLYING":
            return translate?.("status_applying") ?? "APPLYING";
        case "REJECTED":
            return translate?.("status_rejected") ?? "REJECTED";
        case "FORBIDDEN":
            return translate?.("status_forbidden") ?? "FORBIDDEN";
        default:
            if (config.active) {
                return translate?.("status_open") ?? "Active";
            }
            return translate?.("status_close") ?? "Inactive";
    }
}

/** Resolve payment-brand label; config still stores institution code in bankCode until backend renames. */
export function getInstitutionLabel(
    institutionCode: string,
    institutions: FinancialInstitutionView[],
    institutionName?: string,
): string {
    if (institutionName) return institutionName;
    return (
        institutions.find((item) => item.institutionCode === institutionCode)?.institutionName ??
        institutionCode
    );
}

export function getChannelLabel(channelCode: string, channels: ChannelView[], channelName?: string): string {
    if (channelName) return channelName;
    return channels.find((channel) => channel.channelCode === channelCode)?.channelName ?? channelCode;
}

export type ChannelProviderTone = {
    abbreviation: string;
    background: string;
    color: string;
};

/** Visual chip for channel rows — derived from channelCode prefix, not scene institution. */
export function getChannelProviderTone(channelCode: string): ChannelProviderTone {
    const code = channelCode.toUpperCase();
    if (code.startsWith("WECHAT")) {
        return { abbreviation: "WX", background: "#dcfce7", color: "#15803d" };
    }
    if (code.startsWith("ALIPAY")) {
        return { abbreviation: "AP", background: "#dbeafe", color: "#1d4ed8" };
    }
    if (code.startsWith("PAYPAL")) {
        return { abbreviation: "PP", background: "#e0e7ff", color: "#4338ca" };
    }
    if (code.startsWith("STRIPE")) {
        return { abbreviation: "ST", background: "#f3e8ff", color: "#7e22ce" };
    }
    if (code.startsWith("NOWPAYMENTS") || code.startsWith("CRYPTO")) {
        return { abbreviation: "CR", background: "#ffedd5", color: "#c2410c" };
    }
    return {
        abbreviation: code.slice(0, 2) || "CH",
        background: "#f1f5f9",
        color: "#475569",
    };
}

export function getScenarioLabel(config: PaymentConfigView, scenarios: ScenarioView[] = []): string {
    if (config.scenarioName) return config.scenarioName;
    const scenarioCode = config.scenarioCode || config.gatewayCode || config.capabilityCode;
    if (!scenarioCode) return "-";
    return scenarios.find((scenario) => scenario.scenarioCode === scenarioCode)?.scenarioName ?? scenarioCode;
}

export type ConfigOpenStatus = "OPENED" | "NONACTIVEED";

export type ConfigEditData = Pick<PaymentConfigUpdateRequest, "channelCode" | "parameters" | "openStatus">;

const CREDENTIAL_CHANNEL_PREFIXES = ["ALIPAY", "WECHAT", "STRIPE", "PAYPAL", "NOWPAYMENTS"] as const;

/** Secrets must not be echoed; blank on submit means keep existing (backend merges). */
export const SECRET_PARAMETER_KEYS = [
    "appPrivateKey",
    "appSecret",
    "v2ApiKey",
    "v3ApiKey",
    "v3PrivateKey",
    "secretKey",
    "webhookSecret",
    "clientSecret",
    "apiKey",
    "ipnSecret",
] as const;

export type SecretParameterKey = (typeof SECRET_PARAMETER_KEYS)[number];

export function supportsCredentialEdit(channelCode: string): boolean {
    return CREDENTIAL_CHANNEL_PREFIXES.some((prefix) => channelCode.startsWith(prefix));
}

export function toConfigOpenStatus(openStatus?: string): ConfigOpenStatus {
    if (openStatus === "NONACTIVEED" || openStatus === "REJECTED" || openStatus === "FORBIDDEN") {
        return "NONACTIVEED";
    }
    return "OPENED";
}

function asParamRecord(value: unknown): Record<string, unknown> {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value as Record<string, unknown>;
    }
    return {};
}

/** Prefer apiConfig (backend) then parameters (legacy FE alias). */
export function readConfigParams(config: PaymentConfigView): Record<string, unknown> {
    const fromApi = asParamRecord(config.apiConfig);
    if (Object.keys(fromApi).length > 0) {
        return fromApi;
    }
    return asParamRecord(config.parameters);
}

function paramString(params: Record<string, unknown>, key: string): string {
    const value = params[key];
    return typeof value === "string" ? value : value != null ? String(value) : "";
}

function paramBoolean(params: Record<string, unknown>, key: string): boolean {
    return params[key] === true;
}

function isNonEmptySecret(value: unknown): boolean {
    return typeof value === "string" ? value.trim().length > 0 : value != null && String(value).trim().length > 0;
}

/** True when stored config already has this secret (or credential ref). */
export function isSecretConfigured(config: PaymentConfigView, key: SecretParameterKey): boolean {
    const params = readConfigParams(config);
    if (isNonEmptySecret(params[key])) {
        return true;
    }
    if (key === "clientSecret" || key === "secretKey" || key === "apiKey" || key === "appPrivateKey") {
        return isNonEmptySecret(params.providerSecretRef);
    }
    if (key === "webhookSecret" || key === "ipnSecret") {
        return isNonEmptySecret(params.webhookSecretRef);
    }
    return false;
}

export type CredentialProvider = "ALIPAY" | "WECHAT" | "STRIPE" | "PAYPAL" | "NOWPAYMENTS";

export function resolveCredentialProvider(channelCode: string): CredentialProvider | null {
    const code = channelCode.toUpperCase();
    if (code.startsWith("ALIPAY")) return "ALIPAY";
    if (code.startsWith("WECHAT")) return "WECHAT";
    if (code.startsWith("STRIPE")) return "STRIPE";
    if (code.startsWith("PAYPAL")) return "PAYPAL";
    if (code.startsWith("NOWPAYMENTS")) return "NOWPAYMENTS";
    return null;
}

/** Official dashboard / docs entry for retrieving API credentials. */
export function getCredentialHelpUrl(channelCode: string): string | null {
    switch (resolveCredentialProvider(channelCode)) {
        case "STRIPE":
            return "https://dashboard.stripe.com/apikeys";
        case "ALIPAY":
            return "https://open.alipay.com/";
        case "WECHAT":
            return "https://pay.weixin.qq.com/";
        case "PAYPAL":
            return "https://developer.paypal.com/dashboard/";
        case "NOWPAYMENTS":
            return "https://account.nowpayments.io/";
        default:
            return null;
    }
}

export function supportsSandboxToggle(channelCode: string): boolean {
    const provider = resolveCredentialProvider(channelCode);
    return provider === "ALIPAY" || provider === "STRIPE" || provider === "PAYPAL" || provider === "NOWPAYMENTS";
}

export type StripeKeyKind = "secret" | "publishable" | "webhook";

/** Blank values are valid (keep existing secret). Non-blank must match env prefix. */
export function matchesStripeKeyPrefix(
    kind: StripeKeyKind,
    value: string | undefined | null,
    sandbox: boolean,
): boolean {
    if (value == null || value.trim() === "") return true;
    const trimmed = value.trim();
    if (kind === "webhook") return trimmed.startsWith("whsec_");
    if (kind === "secret") return trimmed.startsWith(sandbox ? "sk_test_" : "sk_live_");
    return trimmed.startsWith(sandbox ? "pk_test_" : "pk_live_");
}

export function stripeKeyPlaceholder(kind: StripeKeyKind, sandbox: boolean): string {
    if (kind === "webhook") return "whsec_...";
    if (kind === "secret") return sandbox ? "sk_test_..." : "sk_live_...";
    return sandbox ? "pk_test_..." : "pk_live_...";
}

export function buildConfigEditData(config: PaymentConfigView): ConfigEditData {
    const openStatus = toConfigOpenStatus(config.openStatus);

    if (!supportsCredentialEdit(config.channelCode)) {
        return { channelCode: config.channelCode, openStatus };
    }

    const baseType = config.channelCode.split("_")[0];
    const params = readConfigParams(config);

    if (config.channelCode.startsWith("ALIPAY")) {
        return {
            channelCode: config.channelCode,
            openStatus,
            parameters: {
                type: baseType,
                appId: paramString(params, "appId"),
                partner: paramString(params, "partner"),
                sandbox: paramBoolean(params, "sandbox"),
                alipayPublicKey: paramString(params, "alipayPublicKey"),
                appPrivateKey: "",
            },
        };
    }
    if (config.channelCode.startsWith("WECHAT")) {
        return {
            channelCode: config.channelCode,
            openStatus,
            parameters: {
                type: baseType,
                appId: paramString(params, "appId"),
                appSecret: "",
                mchId: paramString(params, "mchId"),
                v2ApiKey: "",
                v2CertPath: paramString(params, "v2CertPath"),
                v3ApiKey: "",
                v3PrivateKey: "",
                v3PublicKey: paramString(params, "v3PublicKey"),
                v3SerialNo: paramString(params, "v3SerialNo"),
                v3PublicKeyId: paramString(params, "v3PublicKeyId"),
            },
        };
    }
    if (config.channelCode.startsWith("STRIPE")) {
        return {
            channelCode: config.channelCode,
            openStatus,
            parameters: {
                type: baseType,
                secretKey: "",
                publishableKey: paramString(params, "publishableKey"),
                webhookSecret: "",
                sandbox: paramBoolean(params, "sandbox"),
            },
        };
    }
    if (config.channelCode.startsWith("PAYPAL")) {
        return {
            channelCode: config.channelCode,
            openStatus,
            parameters: {
                type: baseType,
                clientId: paramString(params, "clientId"),
                clientSecret: "",
                sandbox: paramBoolean(params, "sandbox"),
                webhookId: paramString(params, "webhookId"),
            },
        };
    }
    if (config.channelCode.startsWith("NOWPAYMENTS")) {
        return {
            channelCode: config.channelCode,
            openStatus,
            parameters: {
                type: baseType,
                apiKey: "",
                ipnSecret: "",
                sandbox: paramBoolean(params, "sandbox"),
                apiVersion: paramString(params, "apiVersion"),
                baseUrl: paramString(params, "baseUrl"),
                defaultCurrency: paramString(params, "defaultCurrency") || "usdt",
            },
        };
    }
    return {
        channelCode: config.channelCode,
        openStatus,
        parameters: stripSecretsForEdit(params),
    };
}

function stripSecretsForEdit(params: Record<string, unknown>): Record<string, unknown> {
    const next = { ...params };
    for (const key of SECRET_PARAMETER_KEYS) {
        if (key in next) {
            next[key] = "";
        }
    }
    return next;
}

/**
 * Build update body: omit blank secrets so backend keeps existing values.
 */
export function buildConfigUpdatePayload(editData: ConfigEditData): PaymentConfigUpdateRequest {
    const parameters = editData.parameters;
    if (!parameters || typeof parameters !== "object") {
        return {
            channelCode: editData.channelCode,
            openStatus: editData.openStatus,
        };
    }

    const next: Record<string, unknown> = { ...(parameters as Record<string, unknown>) };
    for (const key of SECRET_PARAMETER_KEYS) {
        const value = next[key];
        if (value == null || (typeof value === "string" && value.trim() === "")) {
            delete next[key];
        }
    }

    return {
        channelCode: editData.channelCode,
        openStatus: editData.openStatus,
        parameters: next as PaymentConfigUpdateRequest["parameters"],
    };
}
