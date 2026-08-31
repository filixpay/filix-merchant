"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import MarketingPage from '@/components/marketing/MarketingPage';
import styles from '@/components/marketing/marketing.module.css';

export default function TechnologyOverviewContent() {
    const t = useTranslations('Nav');
    const tPages = useTranslations('Pages.architecture');
    const tc = useTranslations('Pages.common');
    const locale = useLocale();

    const techs = [
        { key: 'architecture', icon: '⚙️', href: '/technology/architecture' },
        { key: 'performance', icon: '📈', href: '/technology/performance' },
        { key: 'identity', icon: '🔐', href: '/technology/identity' },
        { key: 'api_docs', icon: '📄', href: '/developers' },
    ];

    return (
        <MarketingPage
            heroTitle={tPages('hero_title')}
            heroDesc={tPages('hero_desc')}
            ctaTitle={t('technology')}
            ctaDesc={tPages('subtitle')}
        >
            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('technology')}</h2>
                    </div>
                    <div className={styles.featureGrid}>
                        {techs.map((item) => (
                            <Link key={item.key} href={`/${locale}${item.href}`} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>{item.icon}</div>
                                <h3 className={styles.featureCardTitle}>
                                    {t(`menu.technology.${item.key}`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {t(`menu.technology.${item.key}_desc`)}
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
