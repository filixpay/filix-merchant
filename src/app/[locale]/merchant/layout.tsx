import SiteNavbar from "@/components/marketing/SiteNavbar";
import SiteFooter from "@/components/marketing/SiteFooter";
import styles from "@/components/legal/legal.module.css";

type Props = {
  children: React.ReactNode;
};

/**
 * Merchant legal pages shell (service agreement, fee rules).
 * Mirrors (legal)/layout so document content is not flush to the viewport edge.
 */
export default function MerchantLegalLayout({ children }: Props) {
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
