"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import styles from './SiteNavbar.module.css';

interface DropdownItem {
    icon: string;
    titleKey: string;
    descKey: string;
    href: string;
}

interface NavSection {
    labelKey: string;
    items: DropdownItem[];
}

const NAV_SECTIONS: NavSection[] = [
    {
        labelKey: 'products',
        items: [
            { icon: '💳', titleKey: 'aggregated_payment', descKey: 'aggregated_payment_desc', href: '/products/payment-platform' },
            { icon: '🏪', titleKey: 'merchant_center', descKey: 'merchant_center_desc', href: '/products/merchant-center' },
            { icon: '💸', titleKey: 'payment_splitting', descKey: 'payment_splitting_desc', href: '/products/payment-splitting' },
            { icon: '🛡️', titleKey: 'risk_control', descKey: 'risk_control_desc', href: '/products/risk-control' },
            { icon: '🏦', titleKey: 'credit_payment', descKey: 'credit_payment_desc', href: '/products/credit-payment' },
            { icon: '₿', titleKey: 'crypto_payment', descKey: 'crypto_payment_desc', href: '/products/crypto-payment' },
            { icon: '🖥️', titleKey: 'private_deployment', descKey: 'private_deployment_desc', href: '/products/private-deployment' },
        ]
    },
    {
        labelKey: 'solutions',
        items: [
            { icon: '🌍', titleKey: 'cross_border', descKey: 'cross_border_desc', href: '/solutions/cross-border-ecommerce' },
            { icon: '🏢', titleKey: 'group_enterprise', descKey: 'group_enterprise_desc', href: '/for-enterprise' },
        ]
    },
    {
        labelKey: 'technology',
        items: [
            { icon: '⚙️', titleKey: 'architecture', descKey: 'architecture_desc', href: '/technology/architecture' },
            { icon: '📈', titleKey: 'performance', descKey: 'performance_desc', href: '/technology/performance' },
            { icon: '🔐', titleKey: 'identity', descKey: 'identity_desc', href: '/technology/identity' },
            { icon: '📄', titleKey: 'api_docs', descKey: 'api_docs_desc', href: '/developers' },
        ]
    },
    {
        labelKey: 'resources',
        items: [
            { icon: '📊', titleKey: 'case_studies', descKey: 'case_studies_desc', href: '/resources/case-studies' },
            { icon: '✅', titleKey: 'compliance', descKey: 'compliance_desc', href: '/resources/compliance' },
            { icon: 'RS', titleKey: 'reconciliation_settlement', descKey: 'reconciliation_settlement_desc', href: '/resources/reconciliation-settlement' },
            { icon: '📝', titleKey: 'blog', descKey: 'blog_desc', href: '/resources/blog' },
            { icon: '📥', titleKey: 'downloads', descKey: 'downloads_desc', href: '/resources/downloads' },
        ]
    },
];

export default function SiteNavbar() {
    const t = useTranslations('Nav');
    const locale = useLocale();
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const leaveTimeout = useRef<NodeJS.Timeout | null>(null);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    // Stable Hover Logic
    const handleMouseEnter = (key: string) => {
        if (leaveTimeout.current) {
            clearTimeout(leaveTimeout.current);
            leaveTimeout.current = null;
        }
        setActiveDropdown(key);
    };

    const handleMouseLeave = () => {
        leaveTimeout.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150); // 150ms buffer to cross gaps
    };

    const closeMobile = useCallback(() => {
        setMobileOpen(false);
        setExpandedMobile(null);
    }, []);

    const toggleMobileSection = (key: string) => {
        setExpandedMobile(prev => prev === key ? null : key);
    };

    const buildHref = (path: string) => {
        if (path.startsWith('/#')) return `/${locale}${path}`;
        return `/${locale}${path}`;
    };

    return (
        <nav ref={navRef} className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href={`/${locale}`} className={styles.logo} onClick={closeMobile}>
                    <img src="/logo.png" alt="FilixPay" className={styles.logoImg} />
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.desktopNav}>
                    {NAV_SECTIONS.map((section) => (
                        <div 
                            key={section.labelKey} 
                            className={`${styles.navItem} ${activeDropdown === section.labelKey ? styles.open : ''}`}
                            onMouseEnter={() => handleMouseEnter(section.labelKey)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href={buildHref(`/${section.labelKey}`)} className={styles.navLink}>
                                {t(section.labelKey)}
                                <svg className={styles.chevron} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <div className={styles.dropdown}>
                                {section.items.map((item) => (
                                    <Link
                                        key={item.titleKey}
                                        href={buildHref(item.href)}
                                        className={styles.dropdownItem}
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        <div className={styles.dropdownIcon}>{item.icon}</div>
                                        <div className={styles.dropdownContent}>
                                            <div className={styles.dropdownTitle}>
                                                {t(`menu.${section.labelKey}.${item.titleKey}`)}
                                            </div>
                                            <div className={styles.dropdownDesc}>
                                                {t(`menu.${section.labelKey}.${item.descKey}`)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Whitepaper - direct link */}
                    <Link href={buildHref('/whitepaper')} className={styles.navLink}>
                        {t('docs')}
                    </Link>
                </div>

                {/* Right Actions */}
                <div className={styles.actions}>
                    <LanguageSwitcher />
                    {session ? (
                        <Link href={`/${locale}/dashboard`} className={styles.signInBtn}>
                            {t('dashboard')}
                        </Link>
                    ) : (
                        <Link href={`/${locale}/login`} className={styles.signInBtn}>
                            {t('login')}
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
                    <div className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${mobileOpen ? styles.open : ''}`}>
                {NAV_SECTIONS.map((section) => (
                    <div key={section.labelKey} className={styles.mobileSection}>
                        <button
                            className={`${styles.mobileSectionTitle} ${expandedMobile === section.labelKey ? styles.expanded : ''}`}
                            onClick={() => toggleMobileSection(section.labelKey)}
                        >
                            {t(section.labelKey)}
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className={`${styles.mobileSubmenu} ${expandedMobile === section.labelKey ? styles.open : ''}`}>
                            {section.items.map((item) => (
                                <Link
                                    key={item.titleKey}
                                    href={buildHref(item.href)}
                                    className={styles.mobileLink}
                                    onClick={closeMobile}
                                >
                                    <div className={styles.mobileLinkIcon}>{item.icon}</div>
                                    <div className={styles.mobileLinkText}>
                                        <div className={styles.mobileLinkTitle}>
                                            {t(`menu.${section.labelKey}.${item.titleKey}`)}
                                        </div>
                                        <div className={styles.mobileLinkDesc}>
                                            {t(`menu.${section.labelKey}.${item.descKey}`)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Whitepaper link */}
                <Link href={buildHref('/whitepaper')} className={styles.mobileDocsLink} onClick={closeMobile}>
                    {t('docs')}
                </Link>

                {/* Mobile Actions */}
                <div className={styles.mobileActions}>
                    <div style={{ marginBottom: 16 }}>
                        <LanguageSwitcher />
                    </div>
                    {session ? (
                        <Link href={`/${locale}/dashboard`} className={styles.mobileSignIn} onClick={closeMobile}>
                            {t('dashboard')}
                        </Link>
                    ) : (
                        <Link href={`/${locale}/login`} className={styles.mobileSignIn} onClick={closeMobile}>
                            {t('login')}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
