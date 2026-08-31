"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import styles from "./private-deployment.module.css";

interface Feature {
  title: string;
  desc: string;
}

const SPEC_ROWS = [
  "os",
  "cpu",
  "memory",
  "disk",
  "docker",
  "compose",
] as const;

const STACK_KEYS = ["postgres", "redis", "keycloak", "compose"] as const;
const STACK_DOTS = [
  styles.techDotBlue,
  styles.techDotPurple,
  styles.techDotCyan,
  styles.techDotEmerald,
] as const;

const FEATURE_ICONS = ["🔒", "📦", "⚡", "🚀"] as const;

const COMPARISON_ROW_KEYS = [
  "scope",
  "audience",
  "infrastructure",
  "licensing",
  "complexity",
  "when_to_choose",
] as const;

const CHECKOUT_DEPLOYMENT_DOC_URL =
  "https://github.com/filixpay/filix-checkout/blob/main/docs/merchant-deployment.md";

const ARCHITECTURE_DIAGRAM = `┌──────────┐     ┌─────────────┐     ┌───────────┐
│  Redis   │     │ PostgreSQL  │◄────│ Keycloak  │
│  :6379   │     │   :5432     │     │ :8080/8443│
└──────────┘     └─────────────┘     └───────────┘
      │                │                │
      └────────────────┴────────────────┘
                  app-network (bridge)`;

export default function PrivateDeploymentContent() {
  const tPage = useTranslations("Pages.private_deployment");
  const tDeployment = useTranslations("Home.deployment");
  const tLicensing = useTranslations("Home.source_licensing");
  const locale = useLocale();

  const features = tDeployment.raw("features") as Feature[];
  const featureAccents = [
    styles.accentBlue,
    styles.accentPurple,
    styles.accentEmerald,
    styles.accentCyan,
  ];

  const pricingFeatures = tPage.raw("pricing_included") as string[];

  const licensingIncludedTitle = tLicensing("sections.included.title");
  const licensingIncludedItems = tLicensing.raw("sections.included.items") as string[];

  const licensingScopeTitle = tLicensing("sections.scope.title");
  const licensingScopeItems = tLicensing.raw("sections.scope.items") as string[];

  const licensingProhibitedTitle = tLicensing("sections.prohibited.title");
  const licensingProhibitedSubtitle = tLicensing("sections.prohibited.subtitle");
  const licensingProhibitedItems = tLicensing.raw("sections.prohibited.items") as string[];

  const ipOwnershipTitle = tLicensing("sections.ip_ownership.title");
  const ipOwnershipItems = tLicensing.raw("sections.ip_ownership.items") as string[];

  return (
    <div className={styles.pageWrapper}>
      {/* SECTION 1: HERO */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroBadge}>{tPage("badge")}</div>

          <h1 className={styles.heroTitle}>
            <span className={`${styles.titleLine} ${styles.gradientText}`}>
              {tPage("hero_title")}
            </span>
          </h1>

          <h2 className={styles.heroSubtitle}>{tDeployment("subtitle")}</h2>

          <p className={styles.heroIntro}>{tDeployment("intro")}</p>

          <div className={styles.ctaGroup}>
            <a href="mailto:invest@filixpay.com" className={styles.primaryButton}>
              {tPage("final_cta_primary")}
            </a>
            <Link href={`/${locale}/deployment`} className={styles.secondaryButton}>
              {tPage("view_deployment_docs")}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: BENEFITS */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            {tDeployment("benefits_title").replace(/^✅\s*/, "")}
          </h2>

          <div className={styles.advantagesGrid}>
            {features.map((feat, i) => (
              <div key={feat.title} className={styles.advantageCard}>
                <div
                  className={`${styles.cardAccentBar} ${featureAccents[i] || styles.accentBlue}`}
                />
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconBox}>{FEATURE_ICONS[i] || "✓"}</div>
                  <h3 className={styles.cardTitle}>{feat.title}</h3>
                </div>
                <p className={styles.cardDesc}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2.5: DEPLOYMENT COMPARISON */}
      <section id="deployment-comparison" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{tPage("deployment_comparison.title")}</h2>
          <p className={styles.heroIntro} style={{ textAlign: "center", marginBottom: 40 }}>
            {tPage("deployment_comparison.desc")}
          </p>
          <div className={styles.specTableWrapper}>
            <table className={styles.specTable}>
              <thead>
                <tr>
                  <th scope="col">{tPage("deployment_comparison.columns.dimension")}</th>
                  <th scope="col">{tPage("deployment_comparison.columns.checkout")}</th>
                  <th scope="col">{tPage("deployment_comparison.columns.full_stack")}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROW_KEYS.map((key) => (
                  <tr key={key}>
                    <th scope="row" className={styles.specItemName}>
                      {tPage(`deployment_comparison.rows.${key}.label`)}
                    </th>
                    <td className={styles.specItemVal}>
                      {tPage(`deployment_comparison.rows.${key}.checkout`)}
                    </td>
                    <td className={styles.specItemVal}>
                      {tPage(`deployment_comparison.rows.${key}.full_stack`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.ctaGroup} style={{ marginTop: 40 }}>
            <a
              href={CHECKOUT_DEPLOYMENT_DOC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              {tPage("deployment_comparison.checkout_cta")}
            </a>
            <Link href={`/${locale}/products/merchant-center#checkout-deployment`} className={styles.secondaryButton}>
              {tPage("deployment_comparison.merchant_center_cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: DEPLOYMENT SPECIFICATIONS */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{tPage("specs_title")}</h2>

          <div className={styles.specsGrid}>
            <div className={styles.specPanel}>
              <h3 className={styles.specPanelTitle}>{tPage("specs_server_title")}</h3>
              <div className={styles.specTableWrapper}>
                <table className={styles.specTable}>
                  <thead>
                    <tr>
                      <th scope="col">{tPage("specs_col_item")}</th>
                      <th scope="col">{tPage("specs_col_requirement")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPEC_ROWS.map((key) => (
                      <tr key={key}>
                        <th scope="row" className={styles.specItemName}>
                          {tPage(`specs_items.${key}`)}
                        </th>
                        <td className={styles.specItemVal}>
                          {tPage(`specs_items.${key}_value`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.specPanel}>
              <h3 className={styles.specPanelTitle}>{tPage("specs_stack_title")}</h3>
              <div className={styles.techStackList}>
                {STACK_KEYS.map((key, i) => (
                  <div key={key} className={styles.techStackItem}>
                    <div className={`${styles.techDot} ${STACK_DOTS[i]}`} />
                    <div className={styles.techInfo}>
                      <div className={styles.techName}>{tPage(`stack.${key}.name`)}</div>
                      <div className={styles.techDesc}>{tPage(`stack.${key}.desc`)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.architectureDiagramWrapper}>
              <div className={styles.archDiagLabel}>
                <span className={styles.archDiagIcon} aria-hidden="true" />
                <span>{tPage("architecture_label")}</span>
              </div>
              <pre
                className={styles.archDiagPre}
                aria-label="Redis, PostgreSQL, and Keycloak connected on an app-network bridge"
              >
                {ARCHITECTURE_DIAGRAM}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING */}
      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{tPage("pricing_section_title")}</h2>

          <p className={styles.pricingIntro}>{tPage("pricing_intro")}</p>

          <div className={styles.pricingCenter}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingBadge}>{tPage("pricing_badge")}</div>
              <h3 className={styles.pricingPrice}>{tDeployment("price")}</h3>
              <span className={styles.pricingPeriod}>{tPage("pricing_onetime")}</span>

              <h4 className={styles.includedTitle}>{tPage("pricing_included_title")}</h4>
              <ul className={styles.pricingFeatures}>
                {pricingFeatures.map((item) => (
                  <li key={item} className={styles.pricingFeatureItem}>
                    <span className={styles.checkIcon} aria-hidden="true">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.maintenanceBox}>
                <span className={styles.maintenanceLabel}>
                  {tPage("pricing_maintenance_label")}
                </span>
                {tPage("pricing_maintenance_value")}
                <br />
                <small className={styles.maintenanceNote}>
                  ({tDeployment("maintenance")})
                </small>
              </div>

              <a
                href="mailto:invest@filixpay.com"
                className={`${styles.primaryButton} ${styles.widthFull}`}
              >
                {tPage("pricing_cta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: SOURCE CODE LICENSING */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{tPage("licensing_title")}</h2>
          <p className={styles.pricingIntro}>{tLicensing("subtitle")}</p>

          <div className={styles.licensingGrid}>
            <div className={styles.licensingCard}>
              <h3 className={`${styles.licensingCardTitle} ${styles.licensingCardTitleGreen}`}>
                {licensingIncludedTitle}
              </h3>
              <ul className={styles.licensingList}>
                {licensingIncludedItems.map((item) => (
                  <li key={item} className={styles.licensingListItem}>
                    <span
                      className={`${styles.licenseDot} ${styles.licenseDotGreen}`}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.licensingCard}>
              <h3 className={`${styles.licensingCardTitle} ${styles.licensingCardTitleBlue}`}>
                {licensingScopeTitle}
              </h3>
              <ul className={styles.licensingList}>
                {licensingScopeItems.map((item) => (
                  <li key={item} className={styles.licensingListItem}>
                    <span
                      className={`${styles.licenseDot} ${styles.licenseDotBlue}`}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.licensingCard}>
              <h3 className={`${styles.licensingCardTitle} ${styles.licensingCardTitleRed}`}>
                {licensingProhibitedTitle}
              </h3>
              {licensingProhibitedSubtitle ? (
                <div className={styles.licensingSubtitle}>{licensingProhibitedSubtitle}</div>
              ) : null}
              <ul className={styles.licensingList}>
                {licensingProhibitedItems.map((item) => (
                  <li key={item} className={styles.licensingListItem}>
                    <span
                      className={`${styles.licenseDot} ${styles.licenseDotRed}`}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.ipNoticeBox}>
            <h4 className={styles.ipNoticeTitle}>{ipOwnershipTitle}</h4>
            <ul className={styles.ipNoticeList}>
              {ipOwnershipItems.map((item) => (
                <li key={item} className={styles.ipNoticeItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.quoteBox}>
            <p className={styles.quoteText}>&ldquo;{tLicensing("footer.trust")}&rdquo;</p>
            <p className={styles.quoteSub}>{tLicensing("footer.slogan")}</p>
          </div>

          <div className={styles.centerActions}>
            <Link href={`/${locale}/resources/downloads`} className={styles.secondaryButton}>
              {tLicensing("footer.download_sample")}
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className={styles.finalCtaSection}>
        <div className={styles.container}>
          <h2 className={styles.finalCtaTitle}>{tPage("final_cta_title")}</h2>
          <p className={styles.finalCtaDesc}>{tPage("final_cta_desc")}</p>
          <div className={styles.finalCtaGroup}>
            <a href="mailto:invest@filixpay.com" className={styles.primaryButton}>
              {tPage("final_cta_primary")}
            </a>
            <Link href={`/${locale}/resources/downloads`} className={styles.secondaryButton}>
              {tPage("final_cta_download")}
            </Link>
            <Link href={`/${locale}/deployment`} className={styles.secondaryButton}>
              {tPage("final_cta_docs")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
