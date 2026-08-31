"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import MarketingPage from '@/components/marketing/MarketingPage';
import styles from '@/components/marketing/marketing.module.css';

export default function SolutionsOverviewContent() {
    const t = useTranslations('Nav');
    const tPages = useTranslations('Pages');
    const tc = useTranslations('Pages.common');
    const locale = useLocale();

    const solutions = [
        { key: 'cross_border', icon: '🌍', href: '/solutions/cross-border-ecommerce' },
        { key: 'group_enterprise', icon: '🏢', href: '/solutions/group-enterprise' },
    ];

    return (
        <MarketingPage
            heroTitle={t('solutions')}
            heroDesc={tPages('products.subtitle')}
            ctaTitle={t('solutions')}
            ctaDesc={tPages('products.subtitle')}
        >
            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('solutions')}</h2>
                    </div>
                    <div className={styles.featureGrid}>
                        {solutions.map((item) => (
                            <Link key={item.key} href={`/${locale}${item.href}`} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>{item.icon}</div>
                                <h3 className={styles.featureCardTitle}>
                                    {t(`menu.solutions.${item.key}`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {t(`menu.solutions.${item.key}_desc`)}
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
