import SiteNavbar from "@/components/marketing/SiteNavbar";
import SiteFooter from "@/components/marketing/SiteFooter";
import styles from "@/components/legal/legal.module.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Legal Trust pages shell. Do not gate on enableMarketing.
 * Non-content locales: child pages call ensureLegalLocale for 308 → /en/{slug}.
 */
export default async function LegalLayout({ children }: Props) {
  return (
    <>
      <SiteNavbar />
      <div className={styles.shell}>
        <main className={styles.main}>{children}</main>
      </div>
      <SiteFooter />
    </>
  );
}
