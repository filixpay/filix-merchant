"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import MarketingPage from '@/components/marketing/MarketingPage';
import styles from '@/components/marketing/marketing.module.css';

export default function ProductsOverviewContent() {
    const t = useTranslations('Pages.products');
    const tNav = useTranslations('Nav');
    const tc = useTranslations('Pages.common');
    const locale = useLocale();

    const productItems = [
        {
            key: 'aggregated_payment',
            icon: '💳',
            href: `/${locale}/products/payment-platform`
        },
        {
            key: 'merchant_center',
            icon: '🏪',
            href: `/${locale}/products/merchant-center`
        },
        {
            key: 'payment_splitting',
            icon: '💸',
            href: `/${locale}/products/payment-splitting`
        },
        {
            key: 'risk_control',
            icon: '🛡️',
            href: `/${locale}/products/risk-control`
        },
        {
            key: 'credit_payment',
            icon: '🏦',
            href: `/${locale}/products/credit-payment`
        },
        {
            key: 'crypto_payment',
            icon: '₿',
            href: `/${locale}/products/crypto-payment`
        },
        {
            key: 'private_deployment',
            icon: '🖥️',
            href: `/${locale}/products/private-deployment`
        }
    ];

    return (
        <MarketingPage
            heroTitle={t('hero_title')}
            heroDesc={t('hero_desc')}
            ctaTitle={t('hero_title')}
            ctaDesc={t('subtitle')}
        >
            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('title')}</h2>
                        <p className={styles.sectionSubtitle}>{t('subtitle')}</p>
                    </div>
                    <div className={styles.featureGrid}>
                        {productItems.map((item) => (
                            <Link key={item.key} href={item.href} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>{item.icon}</div>
                                <h3 className={styles.featureCardTitle}>
                                    {tNav(`menu.products.${item.key}`)}
                                </h3>
                                <p className={styles.featureCardDesc}>
                                    {tNav(`menu.products.${item.key}_desc`)}
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
