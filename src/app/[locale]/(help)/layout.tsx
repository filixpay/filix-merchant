import SiteNavbar from "@/components/marketing/SiteNavbar";
import SiteFooter from "@/components/marketing/SiteFooter";
import HelpShell from "@/components/help/HelpShell";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Help product docs shell. Do not gate on enableMarketing.
 * Non-content locales: child pages call ensureHelpLocale for 308 → /en/help/...
 */
export default async function HelpLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <>
      <SiteNavbar />
      <HelpShell locale={locale}>{children}</HelpShell>
      <SiteFooter />
    </>
  );
}
