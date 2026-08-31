"use client";

import type { ReactNode } from "react";
import { Button, Empty, Space } from "antd";
import { useTranslations } from "next-intl";

interface DashboardTableErrorProps {
    description: ReactNode;
    onRetry?: () => void;
}

export default function DashboardTableError({ description, onRetry }: DashboardTableErrorProps) {
    const tCommon = useTranslations("Common");

    return (
        <Space direction="vertical" size={12} align="center">
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
            {onRetry ? <Button onClick={onRetry}>{tCommon("refresh")}</Button> : null}
        </Space>
    );
}
