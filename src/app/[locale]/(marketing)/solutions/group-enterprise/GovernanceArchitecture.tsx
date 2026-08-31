"use client";

import { useTranslations } from "next-intl";
import styles from "./group-enterprise.module.css";

const BRANCH_COUNT = 2;

export default function GovernanceArchitecture() {
  const t = useTranslations("Pages.group_enterprise.architecture");

  const diagramLabel = [
    t("lead"),
    `${t("layers.identity")} → ${t("layers.enterprise")} (${t("layers.admin")}, ${t("layers.viewer")})`,
    `${t("layers.organization")} → ${t("layers.merchant")}`,
    t("not_org_chart"),
  ].join(". ");

  return (
    <section className={styles.sectionAlt} aria-labelledby="governance-architecture-title">
      <div className={styles.container}>
        <h2 id="governance-architecture-title" className={styles.title}>
          {t("title")}
        </h2>

        <div className={styles.architectureWrap}>
          <p className={styles.architectureLead}>{t("lead")}</p>
          <p className={styles.architectureLeadEn}>{t("lead_en")}</p>
          <p className={styles.architectureReinforcing}>{t("reinforcing")}</p>

          <div
            className={styles.architectureDiagram}
            role="img"
            aria-label={diagramLabel}
          >
            <div className={styles.architectureLayer}>
              <div className={`${styles.layerCard} ${styles.layerCardIdentity}`}>
                {t("layers.identity")}
              </div>
            </div>

            <div className={styles.architectureConnector} aria-hidden="true">
              <span className={styles.architectureConnectorArrow}>→</span>
            </div>

            <div className={styles.architectureLayer}>
              <div className={`${styles.layerCard} ${styles.layerCardEnterprise}`}>
                <span className={styles.layerCardLabel}>{t("layers.enterprise")}</span>
                <div className={styles.roleBadges}>
                  <span className={styles.roleBadge}>{t("layers.admin")}</span>
                  <span className={styles.roleBadgeMuted}>{t("layers.viewer")}</span>
                </div>
              </div>
            </div>

            <div className={styles.architectureFork} aria-hidden="true">
              <div className={styles.architectureForkStem} />
              <div className={styles.architectureForkBar} />
            </div>

            <div className={styles.architectureBranches}>
              {Array.from({ length: BRANCH_COUNT }, (_, index) => (
                <div key={index} className={styles.architectureBranch}>
                  <div className={styles.architectureBranchStem} aria-hidden="true" />
                  <div className={styles.branchChain}>
                    <div className={`${styles.layerCard} ${styles.layerCardOrganization}`}>
                      {t("layers.organization")}
                    </div>
                    <span className={styles.branchArrow} aria-hidden="true">
                      →
                    </span>
                    <div className={`${styles.layerCard} ${styles.layerCardMerchant}`}>
                      {t("layers.merchant")}
                    </div>
                    <span className={styles.branchEllipsis} aria-hidden="true">
                      …
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className={styles.architectureNotOrgChart}>{t("not_org_chart")}</p>
          <p className={styles.architectureFootnote}>{t("example_footnote")}</p>
        </div>
      </div>
    </section>
  );
}
