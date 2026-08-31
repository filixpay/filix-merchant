import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface CheckoutConfigItem {
    id?: number;
    merchantConfigId: number;
    priority: number;
    enabled: boolean;
    recommended: boolean;
    // For view only
    bankCode?: string;
    channelCode?: string;
}

export interface MerchantCheckoutRequest {
    checkoutCode: string;
    titles: Record<string, string>;
    logo?: string;
    color?: string;
    currencies?: string[];
    buyerCountries?: string[];
    configs: CheckoutConfigItem[];
}

export interface CheckoutView {
    id: number;
    checkoutCode: string;
    checkoutTitles: Record<string, string>;
    logo?: string;
    color?: string;
    currencies?: string[];
    buyerCountries?: string[];
    configs: CheckoutConfigItem[];
    checkoutStatus: 'ACTIVE' | 'INACTIVE';
    version: number;
    createdAt: string;
    updatedAt: string;
    // For backward compatibility and flexible mapping
    titles?: Record<string, string>;
    status?: 'ACTIVE' | 'INACTIVE';
}

export const checkoutsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<CheckoutView>(ENDPOINTS.PORTAL.CHECKOUTS, params, token),
    get: (id: number, token: string) =>
        request<CheckoutView>(`${ENDPOINTS.PORTAL.CHECKOUTS}/${id}`, {
            headers: authHeaders(token),
        }),
    create: (data: MerchantCheckoutRequest, token: string) =>
        request<CheckoutView>(ENDPOINTS.PORTAL.CHECKOUTS, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    update: (id: number, data: MerchantCheckoutRequest, token: string) =>
        request<CheckoutView>(`${ENDPOINTS.PORTAL.CHECKOUTS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    delete: (id: number, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.CHECKOUTS}/${id}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        }),
    activate: (id: number, token: string) =>
        request<CheckoutView>(`${ENDPOINTS.PORTAL.CHECKOUTS}/${id}/active`, {
            method: 'PUT',
            headers: authHeaders(token),
        }),
    deactivate: (id: number, token: string) =>
        request<CheckoutView>(`${ENDPOINTS.PORTAL.CHECKOUTS}/${id}/inactive`, {
            method: 'PUT',
            headers: authHeaders(token),
        }),
};
