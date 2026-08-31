"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./group-enterprise.module.css";

const PLACEHOLDERS = {
  directory: "/marketing/group-enterprise/directory-placeholder.svg",
  switch: "/marketing/group-enterprise/switch-placeholder.svg",
  audit: "/marketing/group-enterprise/audit-placeholder.svg",
} as const;

const DASHBOARD_ASSET = "/marketing/group-enterprise/dashboard.webp";

/** Add paths here when WebP assets ship to avoid 404s for optional shots. */
const SHIPPED_ASSETS = new Set<string>([]);

const FIXED_SHOTS = ["directory", "switch", "audit"] as const;

type FixedShot = (typeof FIXED_SHOTS)[number];
type PortalShot = FixedShot | "dashboard";

type ShotConfig = {
  key: PortalShot;
  src: string;
};

function buildShots(hasDashboard: boolean): ShotConfig[] {
  const shots: ShotConfig[] = FIXED_SHOTS.map((key) => ({
    key,
    src: PLACEHOLDERS[key],
  }));

  if (hasDashboard && SHIPPED_ASSETS.has(DASHBOARD_ASSET)) {
    shots.unshift({ key: "dashboard", src: DASHBOARD_ASSET });
  }

  return shots;
}

export default function EnterpriseManagementPortalShowcase() {
  const t = useTranslations("Pages.group_enterprise.portal");
  const hasDashboard = t.has("shots.dashboard.title");
  const shots = buildShots(hasDashboard);

  return (
    <section className={styles.section} aria-labelledby="enterprise-portal-title">
      <div className={styles.container}>
        <h2 id="enterprise-portal-title" className={styles.title}>
          {t("title")}
        </h2>

        <div className={styles.portalGrid}>
          {shots.map(({ key, src }) => {
            const title = t(`shots.${key}.title`);
            const alt = t(`shots.${key}.alt`);
            const caption = t(`shots.${key}.caption`);

            return (
              <figure key={key} className={styles.portalFigure}>
                <h3 className={styles.portalFigureTitle}>{title}</h3>
                <Image
                  src={src}
                  alt={alt}
                  title={title}
                  width={1600}
                  height={900}
                  className={styles.portalImage}
                />
                <figcaption className={styles.portalCaption}>{caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
