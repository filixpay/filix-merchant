import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface AlipayParameters {
    type: string;
    appId: string;
    partner: string;
    sandbox: boolean;
    alipayPublicKey: string;
    appPrivateKey: string;
}

export interface WechatParameters {
    type: string;
    appId: string;
    appSecret: string;
    mchId: string;
    v2ApiKey: string;
    v2CertPath?: string;
    v3ApiKey: string;
    v3PrivateKey: string;
    v3PublicKey: string;
    v3SerialNo: string;
    v3PublicKeyId?: string;
}

export interface StripeParameters {
    type: string;
    secretKey: string;
    publishableKey?: string;
    webhookSecret?: string;
    sandbox: boolean;
}

export interface PayPalParameters {
    type: string;
    clientId: string;
    clientSecret: string;
    sandbox: boolean;
    webhookId?: string;
}

export interface NowPaymentsParameters {
    type: string;
    apiKey: string;
    ipnSecret?: string;
    sandbox: boolean;
    apiVersion?: string;
    baseUrl?: string;
    defaultCurrency?: string;
}

export type PaymentChannelParameters =
    | AlipayParameters
    | WechatParameters
    | StripeParameters
    | PayPalParameters
    | NowPaymentsParameters;

export type PaymentConfigParameters = PaymentChannelParameters | Record<string, unknown>;

export interface PaymentConfigView {
    id: number;
    merchantId: number;
    bankCode: string;
    bankName?: string;
    channelCode: string;
    channelName?: string;
    scenarioCode?: string;
    scenarioName?: string;
    capabilityCode?: string;
    gatewayCode?: string;
    rate?: number;
    subMerchantId?: number;
    active?: boolean;
    openStatus?: string;
    createdAt: string;
    updatedAt?: string;
    /** Backend serializes MerchantConfig.apiConfig; prefer this for edit echo. */
    apiConfig?: PaymentConfigParameters;
    /** Legacy / alias; buildConfigEditData falls back when apiConfig is absent. */
    parameters?: PaymentConfigParameters;
}

export interface PaymentConfigCreateRequest {
    subMerchantId: number;
    bankCode: string;
    channelCode: string;
    scenarioCode: string;
}

export interface PaymentConfigUpdateRequest {
    rate?: number;
    subMerchantId?: number;
    channelCode: string;
    openStatus?: "OPENED" | "NONACTIVEED";
    parameters?: PaymentConfigParameters;
}

export const configsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<PaymentConfigView>(ENDPOINTS.PORTAL.CONFIGS, params, token),
    get: (id: number) =>
        request<PaymentConfigView>(`${ENDPOINTS.PORTAL.CONFIGS}/${id}`),
    create: (data: PaymentConfigCreateRequest, token: string) =>
        request<PaymentConfigView>(ENDPOINTS.PORTAL.CONFIGS, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    update: (id: number, data: PaymentConfigUpdateRequest, token: string) =>
        request<PaymentConfigView>(`${ENDPOINTS.PORTAL.CONFIGS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    delete: (id: number, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.CONFIGS}/${id}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        }),
};
