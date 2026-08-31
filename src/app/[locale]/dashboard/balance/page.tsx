import { redirect } from "next/navigation";
import { moneyBalancePath } from "@/lib/money/balance-redirect";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/** Legacy wallet balance route → Money product Balance (locale-aware). */
export default async function LegacyBalanceRedirectPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(moneyBalancePath(locale));
}
