"use client";

import { useTranslations } from "next-intl";
import MarketingPage from "@/components/marketing/MarketingPage";
import GovernanceArchitecture from "./GovernanceArchitecture";
import EnterpriseManagementPortalShowcase from "./EnterpriseManagementPortalShowcase";
import styles from "./group-enterprise.module.css";

const SCENARIO_KEYS = ["scenario_0", "scenario_1", "scenario_2", "scenario_3"] as const;

type PainPoint = { title: string; desc: string; consequences: string };
type Capability = { icon: string; title: string; desc: string };
type TableRow = [string, string];

export default function GroupEnterpriseContent() {
  const t = useTranslations("Pages.group_enterprise");
  const tc = useTranslations("Pages.common");

  const painPoints = t.raw("pain_points.items") as PainPoint[];
  const capabilities = t.raw("capabilities.items") as Capability[];
  const governanceRows = t.raw("governance_model.items") as TableRow[];
  const rules = t.raw("rules.items") as TableRow[];
  const compliance = t.raw("compliance.items") as TableRow[];

  return (
    <MarketingPage
      badge={t("title")}
      heroTitle={t("hero_title")}
      heroDesc={t("hero_desc")}
      heroDescExtra={t("hero_ending")}
    >
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>{t("pain_points.title")}</h2>
          <div className={styles.painGrid}>
            {painPoints.map((point, i) => (
              <div key={i} className={styles.painCard}>
                <h3 className={styles.painCardTitle}>
                  <span>⚠️</span> {point.title}
                </h3>
                <p className={styles.painCardDesc}>{point.desc}</p>
                <div className={styles.painCardConsequence}>
                  <strong>{tc("consequences") || "后果"}:</strong> {point.consequences}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GovernanceArchitecture />

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>{t("capabilities.title")}</h2>
          <div className={styles.solutionGrid}>
            {capabilities.map((item, i) => (
              <div key={i} className={styles.solutionCard}>
                <div className={styles.solutionIcon}>{item.icon}</div>
                <h3 className={styles.solutionTitle}>{item.title}</h3>
                <p className={styles.solutionDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <h2 className={styles.title}>{t("governance_model.title")}</h2>
          <p className={styles.sectionIntro}>{t("governance_model.intro")}</p>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("governance_model.headers.0")}</th>
                  <th>{t("governance_model.headers.1")}</th>
                </tr>
              </thead>
              <tbody>
                {governanceRows.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{row[0]}</strong>
                    </td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={styles.sectionFootnote}>{t("governance_model.admin_not_owner")}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>{t("rules.title")}</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("rules.headers.0")}</th>
                  <th>{t("rules.headers.1")}</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{row[0]}</strong>
                    </td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.container}>
          <h2 className={styles.title}>{t("scenarios.title")}</h2>
          <div className={styles.scenarioList}>
            {SCENARIO_KEYS.map((key, index) => (
              <div key={key} className={styles.scenarioCard}>
                <div className={styles.scenarioInfo}>
                  <span className={styles.scenarioTag}>
                    SCENARIO {String(index).padStart(2, "0")}
                  </span>
                  <h3 className={styles.scenarioTitle}>{t(`scenarios.${key}.title`)}</h3>
                  <div className={styles.scenarioProcess}>
                    {t(`scenarios.${key}.process`)}
                  </div>
                  <p className={styles.scenarioValue}>{t(`scenarios.${key}.value`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>{t("compliance.title")}</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("compliance.headers.0")}</th>
                  <th>{t("compliance.headers.1")}</th>
                </tr>
              </thead>
              <tbody>
                {compliance.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{row[0]}</strong>
                    </td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <EnterpriseManagementPortalShowcase />
    </MarketingPage>
  );
}
