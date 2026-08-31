export function getSubMerchantStatusColor(status: string): string {
    return status === "ACTIVE" ? "success" : "default";
}
