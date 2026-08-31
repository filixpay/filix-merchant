import { ENDPOINTS } from "../../api-config";
import { pagedGet } from "../query";

export interface ClientView {
    id: number;
    code: number | string;
    email: string;
    mobile: string;
    longTermId: boolean;
    customerStatus: string;
    accountOpeningStatus: string;
    name: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export const clientsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<ClientView>(ENDPOINTS.PORTAL.CLIENTS, params, token),
};
