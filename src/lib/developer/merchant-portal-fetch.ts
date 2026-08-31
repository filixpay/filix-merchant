import {
    buildPortalHeaders,
    resolveClientOrganizationCode,
    resolveClientSelectedGroup,
} from "@/lib/api/portal-headers";

type MerchantPortalFetchOptions = {
    token: string;
    selectedGroup?: string;
    organizationCode?: string;
    init?: Omit<RequestInit, "headers">;
};

export async function merchantPortalFetch(
    url: string,
    options: MerchantPortalFetchOptions,
): Promise<Response> {
    const body = options.init?.body;
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    return fetch(url, {
        ...options.init,
        headers: buildPortalHeaders({
            token: options.token,
            selectedGroup: options.selectedGroup ?? resolveClientSelectedGroup(),
            organizationCode: options.organizationCode ?? resolveClientOrganizationCode(),
            contentType: isFormData ? false : undefined,
        }),
    });
}
