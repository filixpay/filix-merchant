"use client";

import Link from "next/link";
import { Button, Card, Skeleton } from "antd";
import { Bell } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import NotificationList from "./NotificationList";
import { useNotifications } from "@/lib/notifications/use-notifications";

export default function RecentNotificationsWidget() {
    const t = useTranslations("Notifications");
    const locale = useLocale();
    const { data: session } = useSession();
    const accessToken = session?.accessToken;
    const { items, loading, total } = useNotifications(accessToken, { page: 0, size: 5 });

    if (loading) {
        return <Skeleton active paragraph={{ rows: 3 }} />;
    }

    if (total === 0) {
        return null;
    }

    return (
        <Card
            size="small"
            title={
                <>
                    <Bell size={18} strokeWidth={1.5} /> {t("widget.recent")}
                </>
            }
            extra={
                <Link href={`/${locale}/dashboard/notifications`}>
                    <Button type="link" size="small">
                        {t("view_all")}
                    </Button>
                </Link>
            }
        >
            <NotificationList items={items} />
        </Card>
    );
}
