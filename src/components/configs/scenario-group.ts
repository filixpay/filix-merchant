import type {
    FinancialInstitutionView,
    ChannelView,
    PaymentConfigView,
    ScenarioView,
    SubMerchantView,
} from "@/lib/api";
import { getInstitutionLabel, getScenarioLabel } from "./config-model";

export type ScenarioStatusLevel = "full" | "partial" | "none";

export interface ScenarioGroupRefs {
    institutions: FinancialInstitutionView[];
    channels: ChannelView[];
    scenarios: ScenarioView[];
    subMerchants: SubMerchantView[];
}

export interface ScenarioGroup {
    key: string;
    subMerchantId: number;
    /** Institution code (still serialized as bankCode on MerchantConfig). */
    institutionCode: string;
    scenarioCode: string;
    institutionName: string;
    scenarioName: string;
    subMerchantName: string;
    configs: PaymentConfigView[];
    status: { available: number; total: number; level: ScenarioStatusLevel };
}

export type ScenarioMessageKey = "routing_hint" | "scenario_unavailable" | "scenario_applying";

export function resolveScenarioCode(config: PaymentConfigView): string {
    return config.scenarioCode || config.gatewayCode || config.capabilityCode || "";
}

export function buildScenarioKey(
    subMerchantId: number,
    institutionCode: string,
    scenarioCode: string,
): string {
    return `${subMerchantId}_${institutionCode}_${scenarioCode}`;
}

/** Only OPENED configs can collect payments (matches backend routing). */
export function isConfigAvailable(config: PaymentConfigView): boolean {
    if (config.openStatus === "OPENED") return true;
    if (
        config.openStatus === "NONACTIVEED" ||
        config.openStatus === "APPLYING" ||
        config.openStatus === "REJECTED" ||
        config.openStatus === "FORBIDDEN"
    ) {
        return false;
    }
    return config.active === true;
}

export function computeScenarioStatus(configs: PaymentConfigView[]): ScenarioGroup["status"] {
    const total = configs.length;
    const available = configs.filter(isConfigAvailable).length;
    let level: ScenarioStatusLevel = "none";
    if (available === total && total > 0) level = "full";
    else if (available > 0) level = "partial";
    return { available, total, level };
}

export function groupConfigs(records: PaymentConfigView[], refs: ScenarioGroupRefs): ScenarioGroup[] {
    const map = new Map<string, PaymentConfigView[]>();
    for (const record of records) {
        const scenarioCode = resolveScenarioCode(record);
        if (record.subMerchantId == null || !record.bankCode || !scenarioCode) continue;
        const key = buildScenarioKey(record.subMerchantId, record.bankCode, scenarioCode);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(record);
    }
    return Array.from(map.entries()).map(([key, configs]) => {
        const first = configs[0];
        const scenarioCode = resolveScenarioCode(first);
        return {
            key,
            subMerchantId: first.subMerchantId!,
            institutionCode: first.bankCode,
            scenarioCode,
            institutionName: getInstitutionLabel(first.bankCode, refs.institutions, first.bankName),
            scenarioName: getScenarioLabel(first, refs.scenarios),
            subMerchantName:
                refs.subMerchants.find((s) => s.id === first.subMerchantId)?.name ||
                String(first.subMerchantId),
            configs,
            status: computeScenarioStatus(configs),
        };
    });
}

export function getScenarioStatusMessageKey(group: ScenarioGroup): ScenarioMessageKey {
    if (group.status.level !== "none") {
        return "routing_hint";
    }
    const hasApplying = group.configs.some((config) => config.openStatus === "APPLYING");
    if (hasApplying) {
        return "scenario_applying";
    }
    return "scenario_unavailable";
}

export function hasDuplicateConfig(group: ScenarioGroup, channelCode: string): boolean {
    return group.configs.some((c) => c.channelCode === channelCode);
}
