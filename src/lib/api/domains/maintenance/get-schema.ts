import { ENDPOINTS } from "@/lib/api-config";
import { authHeaders, request } from "../../core";
import type { ApplicationSchemaDto } from "../onboarding/types";
import type { ChangeType } from "./types";

export async function getChangeSchema(
    token: string,
    changeType: ChangeType,
    registrationCountry?: string,
): Promise<ApplicationSchemaDto> {
    const query = new URLSearchParams({ changeType });
    if (registrationCountry?.trim()) {
        query.set("registrationCountry", registrationCountry.trim().toUpperCase());
    }
    const path = `${ENDPOINTS.PORTAL.CHANGE_SCHEMAS}?${query.toString()}`;
    // Temporary diagnostics for MERCHANT_MISSING_REGISTRATION_COUNTRY
    console.warn("[change-schemas] request", {
        changeType,
        registrationCountryArg: registrationCountry,
        willSendCountry: Boolean(registrationCountry?.trim()),
        path,
    });
    try {
        const schema = await request<ApplicationSchemaDto>(path, { headers: authHeaders(token) });
        console.warn("[change-schemas] ok", {
            schemaCode: schema.schemaCode,
            registrationCountry: schema.registrationCountry,
            fieldCount: schema.fields?.length ?? 0,
        });
        return schema;
    } catch (err) {
        console.warn("[change-schemas] failed", {
            changeType,
            registrationCountryArg: registrationCountry,
            path,
            err,
        });
        throw err;
    }
}
