"use client";

import Link from 'next/link';
import { useLocale } from 'next-intl';
import styles from './marketing.module.css';

interface Feature {
    icon: string;
    title: string;
    desc: string;
}

interface MarketingPageProps {
    badge?: string;
    heroTitle: string;
    heroDesc: string;
    heroDescExtra?: string;
    features?: Feature[];
    featuresSectionTitle?: string;
    heroPrimaryText?: string;
    heroPrimaryHref?: string;
    heroSecondaryText?: string;
    heroSecondaryHref?: string;
    ctaTitle?: string;
    ctaDesc?: string;
    ctaButtonText?: string;
    ctaButtonHref?: string;
    children?: React.ReactNode;
}

export default function MarketingPage({
    badge,
    heroTitle,
    heroDesc,
    heroDescExtra,
    features,
    featuresSectionTitle,
    heroPrimaryText,
    heroPrimaryHref,
    heroSecondaryText,
    heroSecondaryHref,
    ctaTitle,
    ctaDesc,
    ctaButtonText,
    ctaButtonHref,
    children,
}: MarketingPageProps) {
    const locale = useLocale();

    return (
        <>
            {/* Hero Section */}
            <section className={styles.pageHero}>
                <div className={styles.heroContainer}>
                    {badge && <div className={styles.heroBadge}>{badge}</div>}
                    <h1 className={styles.heroTitle}>{heroTitle}</h1>
                    <div className={styles.heroDescBlock}>
                        <p className={styles.heroSubtitle}>{heroDesc}</p>
                        {heroDescExtra && (
                            <p className={styles.heroSubtitle}>{heroDescExtra}</p>
                        )}
                    </div>
                    <div className={styles.heroActions}>
                        <Link
                            href={heroPrimaryHref || `/${locale}/login`}
                            className={styles.btnPrimary}
                        >
                            {heroPrimaryText || "Get Started"}
                        </Link>
                        {heroSecondaryHref ? (
                            <Link href={heroSecondaryHref} className={styles.btnSecondary}>
                                {heroSecondaryText || "Learn More"}
                            </Link>
                        ) : (
                            <a href="mailto:invest@filixpay.com" className={styles.btnSecondary}>
                                {heroSecondaryText || "Contact Sales"}
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            {features && features.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.sectionContainer}>
                        {featuresSectionTitle && (
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{featuresSectionTitle}</h2>
                            </div>
                        )}
                        <div className={styles.featureGrid}>
                            {features.map((f, i) => (
                                <div key={i} className={styles.featureCard}>
                                    <div className={styles.featureCardIcon}>{f.icon}</div>
                                    <h3 className={styles.featureCardTitle}>{f.title}</h3>
                                    <p className={styles.featureCardDesc}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Custom Content */}
            {children}

            {/* CTA Section */}
            {ctaTitle && (
                <section className={styles.ctaSection}>
                    <div className={styles.ctaContainer}>
                        <h2 className={styles.ctaTitle}>{ctaTitle}</h2>
                        {ctaDesc && <p className={styles.ctaDesc}>{ctaDesc}</p>}
                        <Link
                            href={ctaButtonHref || `/${locale}/login`}
                            className={styles.btnPrimary}
                        >
                            {ctaButtonText || 'Get Started'}
                        </Link>
                    </div>
                </section>
            )}
        </>
    );
}
