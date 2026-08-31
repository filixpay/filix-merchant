"use client";

import type { ReactNode } from "react";
import { Empty } from "antd";

interface DashboardTableEmptyProps {
    description: ReactNode;
}

export default function DashboardTableEmpty({ description }: DashboardTableEmptyProps) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />;
}
