"use client";

import { Typography } from "antd";

interface TradeNoTextProps {
    value?: string | null;
    ellipsis?: boolean;
}

export default function TradeNoText({ value, ellipsis }: TradeNoTextProps) {
    const display = value || "-";

    return (
        <Typography.Text
            copyable={value ? { text: value } : false}
            ellipsis={ellipsis ? { tooltip: display } : false}
        >
            {display}
        </Typography.Text>
    );
}
