"use client";
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import styles from '@/components/marketing/marketing.module.css';

export default function CaseStudiesContent() {
    const t = useTranslations('Pages.case_studies');
    const tc = useTranslations('Pages.common');
    const locale = useLocale();

    const itemsCount = 1;

    return (
        <>
            <section className={styles.pageHero}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroBadge}>{t('title')}</div>
                    <h1 className={styles.heroTitle}>{t('title')}</h1>
                    <p className={styles.heroSubtitle}>{t('subtitle')}</p>
                </div>
            </section>
            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.featureGrid}>
                        {Array.from({ length: itemsCount }).map((_, i) => (
                            <Link 
                                key={i} 
                                href={`/${locale}${t(`items.${i}.link`)}`}
                                className={styles.featureCard}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className={styles.featureCardIcon}>🌍</div>
                                <h3 className={styles.featureCardTitle}>{t(`items.${i}.title`)}</h3>
                                <p className={styles.featureCardDesc}>{t(`items.${i}.desc`)}</p>
                                <div className={styles.btnSecondary} style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '8px 16px', fontSize: '14px' }}>
                                    {tc('learn_more')}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
