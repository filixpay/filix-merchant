"use client";

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import styles from './marketing.module.css';

export default function SiteFooter() {
    const t = useTranslations('SiteFooter');
    const tNav = useTranslations('Nav');
    const locale = useLocale();

    const buildHref = (path: string) => `/${locale}${path}`;

    return (
        <footer className={styles.siteFooter}>
            <div className={styles.footerContainer}>
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.footerBrand}>
                        <img src="/logo-dark.png" alt="FilixPay" className={styles.footerLogo} />
                        <p className={styles.footerSlogan}>{t('slogan')}</p>
                        <nav className={styles.footerFriendlyLinks} aria-label={t('friendly_links_title')}>
                            <span className={styles.footerFriendlyLinksLabel}>{t('friendly_links_title')}</span>
                            <a
                                href="https://www.micselect.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.footerFriendlyLink}
                                title={t('friendly_link_micselect_title')}
                            >
                                {t('friendly_link_micselect')}
                            </a>
                        </nav>
                    </div>

                    {/* Products */}
                    <div>
                        <div className={styles.footerColumnTitle}>{t('products_title')}</div>
                        <Link href={buildHref('/products/payment-platform')} className={styles.footerLink}>{tNav('menu.products.aggregated_payment')}</Link>
                        <Link href={buildHref('/products/merchant-center')} className={styles.footerLink}>{tNav('menu.products.merchant_center')}</Link>
                        <Link href={buildHref('/products/credit-payment')} className={styles.footerLink}>{tNav('menu.products.credit_payment')}</Link>
                        <Link href={buildHref('/products/crypto-payment')} className={styles.footerLink}>{tNav('menu.products.crypto_payment')}</Link>
                        <Link href={buildHref('/products/private-deployment')} className={styles.footerLink}>{tNav('menu.products.private_deployment')}</Link>
                    </div>

                    {/* Solutions */}
                    <div>
                        <div className={styles.footerColumnTitle}>{t('solutions_title')}</div>
                        <Link href={buildHref('/solutions/cross-border-ecommerce')} className={styles.footerLink}>{tNav('menu.solutions.cross_border')}</Link>
                        <Link href={buildHref('/for-enterprise')} className={styles.footerLink}>{tNav('menu.solutions.group_enterprise')}</Link>
                    </div>

                    {/* Technology */}
                    <div>
                        <div className={styles.footerColumnTitle}>{t('technology_title')}</div>
                        <Link href={buildHref('/technology/architecture')} className={styles.footerLink}>{tNav('menu.technology.architecture')}</Link>
                        <Link href={buildHref('/technology/identity')} className={styles.footerLink}>{tNav('menu.technology.identity')}</Link>
                        <Link href={buildHref('/technology/performance')} className={styles.footerLink}>{tNav('menu.technology.performance')}</Link>
                        <Link href={buildHref('/developers')} className={styles.footerLink}>{tNav('menu.technology.api_docs')}</Link>
                    </div>

                    {/* Resources */}
                    <div>
                        <div className={styles.footerColumnTitle}>{t('resources_title')}</div>
                        <Link href={buildHref('/resources/case-studies')} className={styles.footerLink}>{tNav('menu.resources.case_studies')}</Link>
                        <Link href={buildHref('/resources/compliance')} className={styles.footerLink}>{tNav('menu.resources.compliance')}</Link>
                        <Link href={buildHref('/resources/reconciliation-settlement')} className={styles.footerLink}>{tNav('menu.resources.reconciliation_settlement')}</Link>
                        <Link href={buildHref('/resources/blog')} className={styles.footerLink}>{tNav('menu.resources.blog')}</Link>
                        <Link href={buildHref('/resources/downloads')} className={styles.footerLink}>{tNav('menu.resources.downloads')}</Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    {t('rights')}
                </div>
            </div>
        </footer>
    );
}
