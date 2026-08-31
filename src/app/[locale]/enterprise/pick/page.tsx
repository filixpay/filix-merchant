"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Card, List, Spin } from "antd";
import DashboardPage from "@/components/layout/DashboardPage";
import { useEnterpriseCapabilities } from "@/components/layout/use-enterprise-capabilities";
import { enterpriseCodeToString } from "@/components/layout/enterprise-shell";

export default function EnterprisePickPage() {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations("Enterprise.pick");
    const { data: session } = useSession();
    const accessToken = session?.accessToken;

    const { enterprises, enterprisesLoading, selectEnterprise } =
        useEnterpriseCapabilities(accessToken);

    useEffect(() => {
        if (!enterprisesLoading && enterprises.length === 1) {
            selectEnterprise(enterprises[0]);
            router.replace(`/${locale}/enterprise/dashboard`);
        }
    }, [enterprises, enterprisesLoading, locale, router, selectEnterprise]);

    if (enterprisesLoading) {
        return (
            <DashboardPage title={t("title")} subtitle={t("subtitle")} plain>
                <Spin size="large" />
            </DashboardPage>
        );
    }

    return (
        <DashboardPage title={t("title")} subtitle={t("subtitle")}>
            <Card>
                <List
                    dataSource={enterprises}
                    locale={{ emptyText: t("empty") }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <a
                                    key="open"
                                    onClick={() => {
                                        selectEnterprise(item);
                                        router.push(`/${locale}/enterprise/dashboard`);
                                    }}
                                >
                                    {t("open")}
                                </a>,
                            ]}
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={`${t("code")}: ${enterpriseCodeToString(item.enterpriseCode)} · ${item.kind}`}
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </DashboardPage>
    );
}
