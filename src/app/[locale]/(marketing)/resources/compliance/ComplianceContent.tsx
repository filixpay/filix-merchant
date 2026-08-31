"use client";
import { useTranslations } from 'next-intl';
import MarketingPage from '@/components/marketing/MarketingPage';

export default function ComplianceContent() {
    const t = useTranslations('Pages.compliance');
    const tc = useTranslations('Pages.common');

    const features = [
        { icon: '🇪🇺', title: 'GDPR Compliance', desc: 'Full data protection measures including right to erasure, data portability, and consent management for EU/EEA customers.' },
        { icon: '🔒', title: 'PCI-DSS Level 1', desc: 'Our infrastructure meets the highest level of PCI Data Security Standard. All cardholder data is encrypted and tokenized.' },
        { icon: '✈️', title: 'FATF Travel Rule', desc: 'Crypto transactions comply with Financial Action Task Force guidelines for originator and beneficiary information.' },
        { icon: '🏛️', title: 'Regional Regulations', desc: 'Stay compliant with local payment regulations across Asia, Europe, and Americas with our built-in compliance engine.' },
    ];

    return (
        <MarketingPage
            badge={t('title')}
            heroTitle={t('hero_title')}
            heroDesc={t('hero_desc')}
            features={features}
            featuresSectionTitle={tc('key_features')}
            ctaTitle={t('hero_title')}
            ctaDesc={t('subtitle')}
            ctaButtonText={tc('contact_sales')}
        />
    );
}
