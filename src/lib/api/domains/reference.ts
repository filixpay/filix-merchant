import { ENDPOINTS } from "../../api-config";
import { pagedGet } from "../query";

export interface FinancialInstitutionView {
    id: number | string;
    institutionCode: string;
    institutionName: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ChannelView {
    id: number | string;
    channelCode: string;
    channelName: string;
    financialInstitution?: FinancialInstitutionView;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaymentScenarioChannelMapping {
    channelCode?: string;
    channelId?: number | string;
    institutionCode?: string;
    /** @deprecated Prefer institutionCode when API migrates. */
    bankCode?: string;
    active?: boolean;
}

export interface ScenarioView {
    id: number | string;
    scenarioCode: string;
    scenarioName: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    paymentScenarioChannelMapping?: PaymentScenarioChannelMapping[];
}

export const financialInstitutionsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<FinancialInstitutionView>(ENDPOINTS.PORTAL.FINANCIAL_INSTITUTIONS, params, token),
};

export const channelsApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<ChannelView>(ENDPOINTS.PORTAL.CHANNELS, params, token),
};

export const scenariosApi = {
    list: (params: Record<string, string | number> = {}, token: string) =>
        pagedGet<ScenarioView>(ENDPOINTS.PORTAL.SCENARIOS, params, token),
};
