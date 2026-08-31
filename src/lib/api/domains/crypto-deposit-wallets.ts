import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";

export interface CryptoDepositWalletView {
    id: number;
    chainCode: string;
    assetCode: string;
    network: string;
    depositAddress: string;
    label?: string;
    status: string;
    updatedAt: string;
}

export interface CryptoDepositWalletsListResponse {
    platformManaged: boolean;
    canManage: boolean;
    wallets: CryptoDepositWalletView[];
}

export interface CryptoSupportedAsset {
    chainCode: string;
    assetCode: string;
    network?: string;
    chainName?: string;
    assetName?: string;
}

export interface CryptoDepositWalletCreateRequest {
    chainCode: string;
    assetCode: string;
    network?: string;
    depositAddress: string;
    label?: string;
}

export interface CryptoDepositWalletUpdateRequest {
    depositAddress: string;
    label?: string;
}

export interface CryptoDepositWalletStatusRequest {
    status: "ACTIVE" | "INACTIVE";
}

export const cryptoDepositWalletsApi = {
    listSupportedAssets: (token: string) =>
        request<CryptoSupportedAsset[]>(ENDPOINTS.PORTAL.CRYPTO_SUPPORTED_ASSETS, {
            headers: authHeaders(token),
        }),

    list: (token: string) =>
        request<CryptoDepositWalletsListResponse>(ENDPOINTS.PORTAL.CRYPTO_DEPOSIT_WALLETS, {
            headers: authHeaders(token),
        }),

    create: (data: CryptoDepositWalletCreateRequest, token: string) =>
        request<CryptoDepositWalletView>(ENDPOINTS.PORTAL.CRYPTO_DEPOSIT_WALLETS, {
            method: "POST",
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),

    update: (id: number, data: CryptoDepositWalletUpdateRequest, token: string) =>
        request<CryptoDepositWalletView>(`${ENDPOINTS.PORTAL.CRYPTO_DEPOSIT_WALLETS}/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),

    updateStatus: (id: number, data: CryptoDepositWalletStatusRequest, token: string) =>
        request<CryptoDepositWalletView>(`${ENDPOINTS.PORTAL.CRYPTO_DEPOSIT_WALLETS}/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: authHeaders(token),
        }),
};
