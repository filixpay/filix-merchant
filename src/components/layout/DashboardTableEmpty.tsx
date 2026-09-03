"use client";

import type { ReactNode } from "react";
import { Empty } from "antd";

interface DashboardTableEmptyProps {
    description: ReactNode;
    action?: ReactNode;
}

export default function DashboardTableEmpty({ description, action }: DashboardTableEmptyProps) {
    return (
        <div style={{ padding: "48px 0" }}>
            <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE} 
                description={
                    <span style={{ color: "#64748b", fontSize: 13 }}>
                        {description}
                    </span>
                }
            >
                {action && <div style={{ marginTop: 16 }}>{action}</div>}
            </Empty>
        </div>
    );
}
