"use client";

import { useEffect, useState } from "react";
import { Button, Modal, Spin, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { api, LocationQrCodeResponse } from "@/lib/api";

interface LocationQrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    locationId: number | null;
    locationName: string | null;
    accessToken: string;
}

export default function LocationQrCodeModal({
    isOpen,
    onClose,
    locationId,
    locationName,
    accessToken,
}: LocationQrCodeModalProps) {
    const t = useTranslations("Locations");
    const tCommon = useTranslations("Common");
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState<LocationQrCodeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && locationId) {
            setLoading(true);
            setError(null);
            api.locations
                .getQrCode(locationId, accessToken)
                .then(setQrData)
                .catch((err: unknown) => {
                    console.error("Failed to fetch QR code:", err);
                    setError(err instanceof Error ? err.message : "Failed to fetch QR code");
                })
                .finally(() => setLoading(false));
        } else if (!isOpen) {
            setQrData(null);
            setError(null);
        }
    }, [isOpen, locationId, accessToken]);

    const qrImageSource = qrData ? `data:image/png;base64,${qrData.qrCodeBase64}` : "";

    const handleDownload = () => {
        if (!qrImageSource) return;
        const link = document.createElement("a");
        link.href = qrImageSource;
        link.download = `qrcode_${locationName?.replace(/\s+/g, "_") || locationId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal
            title={`${locationName || "Location"} ${t("qrcode")}`}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    {tCommon("close")}
                </Button>,
            ]}
            width={420}
            destroyOnHidden
        >
            <div style={{ textAlign: "center" }}>
                {loading ? (
                    <Spin style={{ padding: 48 }} />
                ) : error ? (
                    <Typography.Text type="danger">{error}</Typography.Text>
                ) : qrData ? (
                    <>
                        <img
                            src={qrImageSource}
                            alt="QR Code"
                            style={{ width: "100%", maxWidth: 280, borderRadius: 8 }}
                        />
                        {qrData.antiFraudCode && (
                            <Typography.Text type="secondary" style={{ display: "block", marginTop: 12 }}>
                                {t("anti_fraud_code")}:{" "}
                                <Typography.Text strong>{qrData.antiFraudCode}</Typography.Text>
                            </Typography.Text>
                        )}
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleDownload}
                            block
                            style={{ marginTop: 16 }}
                        >
                            {tCommon("download")} {t("qrcode")}
                        </Button>
                    </>
                ) : null}
            </div>
        </Modal>
    );
}
