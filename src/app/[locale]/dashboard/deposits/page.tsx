import { redirect } from "next/navigation";
import { moneyMoneyInPath } from "@/lib/money/money-in-redirect";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/** Legacy wallet deposits route → Money product Money-In (locale-aware). */
export default async function LegacyDepositsRedirectPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(moneyMoneyInPath(locale));
}
