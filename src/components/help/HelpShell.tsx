import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HELP_DOMAINS } from "@/content/help/domains";
import {
  isHelpContentLocale,
  type HelpContentLocale,
} from "@/lib/help/content-locales";
import styles from "./help.module.css";

type Props = {
  locale: string;
  children: React.ReactNode;
};

function domainTitleLocale(locale: string): HelpContentLocale {
  return isHelpContentLocale(locale) ? locale : "en";
}

export default async function HelpShell({ locale, children }: Props) {
  // Chrome messages exist for EN/ZH only; other locales fall back for layout chrome
  // until ensureHelpLocale (on pages) 308-redirects to /en/help/...
  const messageLocale = isHelpContentLocale(locale) ? locale : "en";
  const t = await getTranslations({ locale: messageLocale, namespace: "Help" });
  const titleLocale = domainTitleLocale(locale);

  return (
    <div className={styles.shell}>
      <div className={styles.shellInner}>
        <aside className={styles.sidebar} aria-label={t("home_nav")}>
          <Link href={`/${locale}/help`} className={styles.brandLink}>
            {t("home_nav")}
          </Link>
          <p className={styles.brandDesc}>{t("home_description")}</p>
          <nav className={styles.domainNav}>
            {HELP_DOMAINS.map((domain) => (
              <Link
                key={domain.id}
                href={`/${locale}/help/${domain.id}`}
                className={styles.domainLink}
              >
                {domain.title[titleLocale]}
              </Link>
            ))}
          </nav>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
