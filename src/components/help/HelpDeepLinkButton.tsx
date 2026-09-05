"use client";

import Link from "next/link";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useLocale } from "next-intl";
import { getHelpHrefForDashboardPath } from "@/lib/help/dashboard-deep-links";

export function HelpDeepLinkButton({
  dashboardPath,
  helpSlug,
}: {
  dashboardPath: string;
  /** When a path has multiple Help candidates, pick explicitly. */
  helpSlug?: string;
}) {
  const locale = useLocale();
  const href = getHelpHrefForDashboardPath(locale, dashboardPath, helpSlug);
  if (!href) return null;
  return (
    <Link
      href={href}
      aria-label="Help"
      title="Help"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        fontSize: 18,
        lineHeight: 1,
        padding: 4,
      }}
    >
      <QuestionCircleOutlined />
    </Link>
  );
}
