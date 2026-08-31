"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Result, Spin, message } from "antd";
import { signIn, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";

type AcceptState = "idle" | "accepting" | "success" | "error";

export default function InvitationAcceptPage() {
    const t = useTranslations("Organization.invitation_accept");
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token")?.trim() ?? "";
    const { data: session, status } = useSession();
    const accessToken = session?.accessToken;

    const [state, setState] = useState<AcceptState>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const accept = useCallback(async () => {
        if (!accessToken || !token) {
            return;
        }
        setState("accepting");
        setErrorMessage(null);
        try {
            await api.organizations.acceptInvitation(accessToken, token);
            setState("success");
            message.success(t("success"));
        } catch (err) {
            setState("error");
            setErrorMessage(err instanceof ApiError ? err.message : t("failed"));
        }
    }, [accessToken, t, token]);

    useEffect(() => {
        if (!token) {
            setState("error");
            setErrorMessage(t("missing_token"));
            return;
        }
        if (status === "unauthenticated") {
            const callbackUrl = `/${locale}/invitations/accept?token=${encodeURIComponent(token)}`;
            void signIn("keycloak", { callbackUrl });
            return;
        }
        if (status === "authenticated" && state === "idle") {
            void accept();
        }
    }, [accept, locale, state, status, t, token]);

    if (!token) {
        return (
            <div style={{ maxWidth: 560, margin: "64px auto", padding: 24 }}>
                <Result status="error" title={t("title")} subTitle={t("missing_token")} />
            </div>
        );
    }

    if (status === "loading" || status === "unauthenticated" || state === "accepting") {
        return (
            <div style={{ maxWidth: 560, margin: "64px auto", padding: 24, textAlign: "center" }}>
                <Spin size="large" />
                <p style={{ marginTop: 16 }}>{t("processing")}</p>
            </div>
        );
    }

    if (state === "success") {
        return (
            <div style={{ maxWidth: 560, margin: "64px auto", padding: 24 }}>
                <Result
                    status="success"
                    title={t("success_title")}
                    subTitle={t("success_description")}
                    extra={[
                        <Link key="dashboard" href={`/${locale}/dashboard`}>
                            <Button type="primary">{t("go_dashboard")}</Button>
                        </Link>,
                        <Button key="reload-orgs" onClick={() => router.push(`/${locale}/dashboard/organization`)}>
                            {t("go_organization")}
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 560, margin: "64px auto", padding: 24 }}>
            <Card title={t("title")}>
                <Alert type="error" showIcon message={errorMessage || t("failed")} style={{ marginBottom: 16 }} />
                <Button type="primary" onClick={() => void accept()}>
                    {t("retry")}
                </Button>
            </Card>
        </div>
    );
}
