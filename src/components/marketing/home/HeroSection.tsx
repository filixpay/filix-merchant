"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Image } from "antd";
import { ZoomInOutlined } from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_CONFIG } from "@/lib/constants";
import styles from "@/app/[locale]/home.module.css";

// ============================================
// Hero Showcase Image Configuration
// ============================================
// Images live in /public/snap — update SNAP_IMAGE_FILES below.
// Include each file's native width/height so preview stays sharp.
// Supported formats: .webp, .png, .jpg
// ============================================
export interface HeroShowcaseImage {
  /** Path relative to /public, e.g. "/snap/dashboard.png" */
  src: string;
  /** Alt text for accessibility and SEO */
  alt: string;
  /** Native pixel width — keeps preview sharp at full resolution */
  width: number;
  /** Native pixel height */
  height: number;
  /** Optional caption displayed as an overlay label */
  caption?: string;
}

/** Filenames under /public/snap — add or reorder here to change the carousel. */
const SNAP_IMAGE_FILES = [
  { file: "checkout-cashier.png", width: 1024, height: 757 },
  { file: "20441d45-0ec9-407d-9ca5-d7a3381894b8.png", width: 1651, height: 760 },
  { file: "3e2f28fd-4eee-4731-9de2-01ce5e9ebe6a.png", width: 1636, height: 789 },
  { file: "49aa8b0c-96fd-4158-98f7-5a43639d069c.png", width: 1418, height: 727 },
  { file: "7e719415-dab7-4253-8852-5ba660501ae3.png", width: 1646, height: 522 },
  { file: "c2bf8b80-0c68-400b-9e28-fee0d40a3b57.png", width: 1024, height: 483 },
] as const;

/**
 * Showcase images from /public/snap.
 * Images are displayed in order and loop continuously.
 */
export const HERO_SHOWCASE_IMAGES: HeroShowcaseImage[] = SNAP_IMAGE_FILES.map(
  (item, index) => ({
    src: `/snap/${item.file}`,
    alt: `FilixPay platform screenshot ${index + 1}`,
    width: item.width,
    height: item.height,
  }),
);

/** Auto-advance interval in milliseconds */
const SLIDE_INTERVAL = 5000;

export default function HeroSection() {
  const t = useTranslations("Home.hero");
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const imageCount = HERO_SHOWCASE_IMAGES.length;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % imageCount);
  }, [imageCount]);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (isPaused || imageCount <= 1) return;
    const timer = setInterval(goToNext, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, imageCount]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>{t("badge")}</div>
          <h1 className={styles.heroTitle}>{t("title")}</h1>
          <p className={styles.heroSubtitle}>{t("subtitle")}</p>
          <p className={styles.heroSubtitle}>{t("brand_line")}</p>
          <div className={styles.heroActions}>
            <Link href={`/${locale}/login?portal=merchant`} className={styles.btnPrimary}>
              {t("start")}
            </Link>
            <Link href={`/${locale}/developers`} className={styles.btnSecondary}>
              {t("docs")}
            </Link>
            <a
              href={`mailto:${CONTACT_CONFIG.investEmail}`}
              className={styles.btnSecondary}
            >
              {t("contact")}
            </a>
          </div>
        </div>

        {/* ---- Hero Showcase (replaces globe) ---- */}
        <div
          className={styles.heroGraphic}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className={styles.showcaseFrame}>
            {/* Decorative browser chrome dots */}
            <div className={styles.showcaseChrome}>
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
              <span className={styles.chromeDot} />
            </div>

            {/* Image layers – all stacked, only active one is visible */}
            <div className={styles.showcaseViewport}>
              {HERO_SHOWCASE_IMAGES.map((img, i) => (
                <div
                  key={img.src}
                  className={`${styles.showcaseSlide} ${i === activeIndex ? styles.showcaseSlideActive : ""}`}
                >
                  <div className={styles.showcaseSlideInner}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      rootClassName={styles.showcaseImageRoot}
                      className={styles.showcaseImage}
                      preview={{
                        src: img.src,
                        mask: (
                          <div className={styles.showcaseZoomMask}>
                            <ZoomInOutlined />
                            <span>{t("showcase_zoom")}</span>
                          </div>
                        ),
                      }}
                    />
                  </div>
                  {img.caption && (
                    <span className={styles.showcaseCaption}>{img.caption}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Progress indicators */}
            <div className={styles.showcaseIndicators}>
              {HERO_SHOWCASE_IMAGES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`${styles.indicator} ${i === activeIndex ? styles.indicatorActive : ""}`}
                  onClick={() => goToSlide(i)}
                >
                  {i === activeIndex && (
                    <span
                      className={styles.indicatorProgress}
                      style={{
                        animationDuration: `${SLIDE_INTERVAL}ms`,
                        animationPlayState: isPaused ? "paused" : "running",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ambient glow behind the showcase */}
          <div className={styles.showcaseGlow} />
        </div>
      </div>
    </section>
  );
}
