import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";
import { pagedGet } from "../query";

export interface SubMerchantView {
    id: number;
    merchantId: number;
    code: number | string;
    name: string;
    alias: string;
    merchantType: string;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export const subMerchantsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<SubMerchantView>(ENDPOINTS.PORTAL.SUB_MERCHANTS, params, token),
    create: (data: { name: string; alias: string }, token: string) =>
        request<SubMerchantView>(ENDPOINTS.PORTAL.SUB_MERCHANTS, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    update: (id: number, data: { name: string; alias: string }, token: string) =>
        request<SubMerchantView>(`${ENDPOINTS.PORTAL.SUB_MERCHANTS}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
    delete: (id: number, token: string) =>
        request<void>(`${ENDPOINTS.PORTAL.SUB_MERCHANTS}/${id}`, {
            method: 'DELETE',
            headers: authHeaders(token),
        }),
};
