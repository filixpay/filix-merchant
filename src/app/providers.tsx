"use client";

import { useEffect, useState } from "react";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import type { ThemeConfig } from "antd";
import { SessionProvider, useSession } from "next-auth/react";
import { createAppQueryClient } from "@/lib/query/client";

const dashboardTheme: ThemeConfig = {
    token: {
        colorPrimary: "#2563eb",
        colorBgLayout: "#ffffff",
        colorText: "#1e293b",
        colorTextSecondary: "#64748b",
        colorBorder: "#e2e8f0",
        borderRadius: 6,
        fontFamily: "var(--font-sans)",
        fontFamilyCode: "var(--font-mono)",
        fontSize: 14,
        fontSizeHeading1: 28,
        fontSizeHeading2: 22,
        fontSizeHeading3: 18,
        fontSizeHeading4: 15,
        fontSizeLG: 16,
        fontSizeSM: 12,
        lineHeight: 1.65,
        lineHeightHeading1: 1.3,
        lineHeightHeading2: 1.35,
        lineHeightHeading3: 1.4,
        fontWeightStrong: 600,
        colorBgContainer: "#ffffff",
        controlHeight: 34,
        paddingLG: 20,
        marginLG: 20,
    },
    components: {
        Layout: {
            headerBg: "#ffffff",
            siderBg: "#ffffff",
            bodyBg: "#ffffff",
            headerHeight: 56,
        },
        Menu: {
            itemBorderRadius: 6,
            itemHeight: 32,
            itemMarginBlock: 1,
            itemMarginInline: 8,
            fontSize: 13,
            iconSize: 16,
            itemColor: "#64748b",
            itemSelectedColor: "#2563eb",
            itemHoverColor: "#0f172a",
            itemSelectedBg: "#eff6ff",
            itemHoverBg: "#f1f5f9",
            subMenuItemBg: "transparent",
        },
        Table: {
            cellFontSize: 13,
            cellFontSizeMD: 13,
            cellPaddingBlock: 10,
            cellPaddingBlockMD: 10,
            cellPaddingInline: 12,
            cellPaddingInlineMD: 12,
            headerColor: "#334155",
            headerBg: "#f8fafc",
            headerSplitColor: "transparent",
            borderColor: "#f1f5f9",
            rowHoverBg: "#f8fafc",
            headerBorderRadius: 0,
        },
        Button: {
            fontWeight: 500,
            controlHeight: 34,
            paddingInline: 16,
        },
        Typography: {
            titleMarginBottom: 0,
            titleMarginTop: 0,
        },
        Card: {
            paddingLG: 20,
            borderRadiusLG: 8,
        },
        Input: {
            controlHeight: 34,
        },
        Select: {
            controlHeight: 34,
        },
        DatePicker: {
            controlHeight: 34,
        },
        Modal: {
            borderRadiusLG: 10,
        },
        Tag: {
            borderRadiusSM: 4,
        },
        Statistic: {
            contentFontSize: 24,
            titleFontSize: 13,
        },
    },
};

function QueryCacheOnSignOut({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (status === "unauthenticated") {
            queryClient.clear();
        }
    }, [status, queryClient]);

    return children;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(createAppQueryClient);

    return (
        <SessionProvider
            basePath="/auth-api/auth"
            refetchInterval={5 * 60}
            refetchOnWindowFocus={false}
        >
            <QueryClientProvider client={queryClient}>
                <QueryCacheOnSignOut>
                    <AntdRegistry>
                        <ConfigProvider theme={dashboardTheme}>
                            <App>{children}</App>
                        </ConfigProvider>
                    </AntdRegistry>
                </QueryCacheOnSignOut>
            </QueryClientProvider>
        </SessionProvider>
    );
}
