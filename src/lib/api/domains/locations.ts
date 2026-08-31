import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface LocationView {
    id: number;
    merchantId: number;
    subMerchantId?: number;
    subMerchantName?: string;
    name: string;
    mobilePhone?: string;
    cantactEmail?: string;
    servicePhone?: string;
    address?: string;
    country?: string;
    status: string;
    default: boolean;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface LocationUpsertRequest {
    name: string;
    subMerchantId: number;
    address?: string;
    country?: string;
    mobilePhone?: string;
    cantactEmail?: string;
    servicePhone?: string;
    status?: string;
    default?: boolean;
}

export interface LocationQrCodeResponse {
    qrCodeBase64: string;
    antiFraudCode: string;
}

export const locationsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<LocationView>(ENDPOINTS.PORTAL.LOCATIONS, params, token),
    create: (data: LocationUpsertRequest, token: string) =>
        request<LocationView>(ENDPOINTS.PORTAL.LOCATIONS, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    update: (id: number, data: LocationUpsertRequest, token: string) =>
        request<LocationView>(`${ENDPOINTS.PORTAL.LOCATIONS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    delete: (id: number, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.LOCATIONS}/${id}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        }),
    getQrCode: (id: number, token: string) =>
        request<LocationQrCodeResponse>(`${ENDPOINTS.PORTAL.LOCATIONS}/${id}/qrcode`, {
            headers: authHeaders(token),
        }),
};
