import { ENDPOINTS } from "../../api-config";
import { authHeaders, request } from "../core";

export const securityApi = {
    sendCaptcha: (token: string) =>
        request<void>(ENDPOINTS.PORTAL.SECURITY_CAPTCHA_SEND, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify({}),
        }),
    setPaymentPassword: (data: { captcha: string, codeType: string, password: string }, token: string) =>
        request<void>(ENDPOINTS.PORTAL.SECURITY_PAYMENT_PASSWORD, {
            method: 'POST',
            headers: authHeaders(token),
            body: JSON.stringify(data),
        }),
};
