"use client";

import { Descriptions } from "antd";
import { useTranslations } from "next-intl";

interface FraudMetadataPanelProps {
    metadata?: Record<string, unknown>;
    metadataSchemaVersion?: number;
}

const V1_KEYS = [
    "deviceId",
    "ipAddress",
    "velocityCount",
    "amountThreshold",
    "countryCode",
    "cardFingerprint",
] as const;

export default function FraudMetadataPanel({ metadata, metadataSchemaVersion }: FraudMetadataPanelProps) {
    const t = useTranslations("Fraud.detail.metadata");

    if (!metadata || Object.keys(metadata).length === 0) {
        return null;
    }

    if (metadataSchemaVersion === 1) {
        const knownEntries = V1_KEYS.filter((key) => metadata[key] != null);
        if (knownEntries.length > 0) {
            return (
                <Descriptions column={1} size="small" bordered title={t("title")}>
                    {knownEntries.map((key) => (
                        <Descriptions.Item key={key} label={t(`v1.${key}`)}>
                            {String(metadata[key])}
                        </Descriptions.Item>
                    ))}
                </Descriptions>
            );
        }
    }

    return (
        <pre style={{ margin: 0, padding: 12, background: "#f5f5f5", borderRadius: 6, overflow: "auto" }}>
            {JSON.stringify(metadata, null, 2)}
        </pre>
    );
}
