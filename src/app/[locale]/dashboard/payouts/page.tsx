import { redirect } from "next/navigation";
import { moneyPayoutsPath } from "@/lib/money/money-payouts-redirect";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/** Legacy wallet payouts/withdrawals route → Money product Payouts (locale-aware). */
export default async function LegacyPayoutsRedirectPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(moneyPayoutsPath(locale));
}
