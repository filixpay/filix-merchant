"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import MarketingPage from '@/components/marketing/MarketingPage';
import styles from '@/components/marketing/marketing.module.css';

export default function ResourcesOverviewContent() {
    const t = useTranslations('Nav');
    const tc = useTranslations('Pages.common');
    const locale = useLocale();

    const resources = [
        { key: 'case_studies', icon: '📊', href: '/resources/case-studies' },
        { key: 'compliance', icon: '✅', href: '/resources/compliance' },
        { key: 'reconciliation_settlement', icon: 'RS', href: '/resources/reconciliation-settlement' },
        { key: 'blog', icon: '📝', href: '/resources/blog' },
        { key: 'downloads', icon: '📥', href: '/resources/downloads' },
    ];

    return (
        <MarketingPage
            heroTitle={t('resources')}
            heroDesc="Guides, case studies, and technical resources to help you build better payments."
            ctaTitle={t('resources')}
            ctaDesc="Explore our comprehensive resource library."
        >
            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('resources')}</h2>
                    </div>
                    <div className={styles.featureGrid}>
                        {resources.map((item) => (
                            <Link key={item.key} href={`/${locale}${item.href}`} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>{item.icon}</div>
                                <h3 className={styles.featureCardTitle}>
                                    {t(`menu.resources.${item.key}`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {t(`menu.resources.${item.key}_desc`)}
                                </p>
                                <div className={styles.btnSecondary} style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '8px 16px', fontSize: '14px' }}>
                                    {tc('learn_more')}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </MarketingPage>
    );
}
