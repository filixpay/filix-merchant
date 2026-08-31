export type MerchantCoverageConfigStatus = "ACTIVE" | "DISABLED" | "MAINTENANCE";

export interface CoverageConfigView {
    id: string;
    provider: string;
    status: MerchantCoverageConfigStatus;
    configVersion: number;
    configJson: string;
    secrets: Record<string, string>;
    updatedAt: string;
}

export interface CoverageConfigField {
    name: string;
    fieldType: "string" | "number" | "enum";
    required: boolean;
    options?: string[];
}

export interface CoverageSecretField {
    name: string;
    secretType: string;
    required: boolean;
}

export interface CoverageProviderSchema {
    type: string;
    enabled: boolean;
    configFields?: CoverageConfigField[];
    secretFields?: CoverageSecretField[];
}

export interface CoverageConfigCreateRequest {
    provider: string;
    configJson: string;
    secrets?: Record<string, string>;
}

export interface CoverageConfigUpdateRequest {
    configJson: string;
    secrets?: Record<string, string>;
}

export interface CoverageConnectionTestResult {
    status: string;
    latencyMs: number;
    providerVersion?: string | null;
}
