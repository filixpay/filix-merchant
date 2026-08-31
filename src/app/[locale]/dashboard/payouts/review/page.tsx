import { redirect } from "next/navigation";
import { moneyPayoutsPath } from "@/lib/money/money-payouts-redirect";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/** Legacy Agency 代付复核 was retired; canonical surface is Money Payouts. */
export default async function LegacyPayoutReviewRedirectPage({ params }: PageProps) {
  const { locale } = await params;
  redirect(moneyPayoutsPath(locale));
}
