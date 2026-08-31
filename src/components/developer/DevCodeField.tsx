"use client";

import { useState } from "react";
import { Button, Input, Space, Tooltip } from "antd";
import { CopyOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const fieldStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    background: "#f8fafc",
    borderColor: "#e2e8f0",
    color: "#1e293b",
};

type DevCodeFieldProps = {
    value: string;
    copyable?: boolean;
    secret?: boolean;
    copyLabel?: string;
    revealLabel?: string;
    hideLabel?: string;
    onCopy?: (value: string) => void;
};

export default function DevCodeField({
    value,
    copyable = false,
    secret = false,
    copyLabel = "Copy",
    revealLabel = "Show",
    hideLabel = "Hide",
    onCopy,
}: DevCodeFieldProps) {
    const [revealed, setRevealed] = useState(false);

    const handleCopy = () => {
        void navigator.clipboard.writeText(value);
        onCopy?.(value);
    };

    const suffix = (
        <Space size={2}>
            {secret ? (
                <Tooltip title={revealed ? hideLabel : revealLabel}>
                    <Button
                        type="text"
                        size="small"
                        aria-label={revealed ? hideLabel : revealLabel}
                        icon={revealed ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => setRevealed((prev) => !prev)}
                    />
                </Tooltip>
            ) : null}
            {copyable ? (
                <Tooltip title={copyLabel}>
                    <Button
                        type="text"
                        size="small"
                        aria-label={copyLabel}
                        icon={<CopyOutlined />}
                        onClick={handleCopy}
                    />
                </Tooltip>
            ) : null}
        </Space>
    );

    return (
        <Input
            readOnly
            value={value}
            type={secret && !revealed ? "password" : "text"}
            style={fieldStyle}
            suffix={copyable || secret ? suffix : undefined}
        />
    );
}
