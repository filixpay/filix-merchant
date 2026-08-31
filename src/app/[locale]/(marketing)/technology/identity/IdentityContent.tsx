"use client";
import { useTranslations } from 'next-intl';
import MarketingPage from '@/components/marketing/MarketingPage';
import styles from '@/components/marketing/marketing.module.css';

export default function IdentityContent() {
    const t = useTranslations('Pages.identity');
    const tc = useTranslations('Pages.common');

    const features = [
        { icon: '🛡️', title: t('feature_1_title'), desc: t('feature_1_desc') },
        { icon: '🔑', title: t('feature_2_title'), desc: t('feature_2_desc') },
        { icon: '📋', title: t('feature_3_title'), desc: t('feature_3_desc') },
        { icon: '⚡', title: t('feature_4_title'), desc: t('feature_4_desc') },
    ];

    const cases = t.raw('cases') as { name: string; desc: string }[];
    const integrationItems = t.raw('integration_items') as string[];

    return (
        <MarketingPage
            badge={t('title')}
            heroTitle={t('hero_title')}
            heroDesc={t('hero_desc')}
            features={features}
            featuresSectionTitle={t('features_title')}
            ctaTitle={t('cta_quote')}
            ctaDesc={t('cta_desc')}
            ctaButtonText={tc('get_started')}
        >
            {/* Case Studies Section */}
            <section className={styles.sectionAlt}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>{t('why_keycloak_title')}</h2>
                        <p className={styles.sectionSubtitle}>{t('why_keycloak_desc')}</p>
                    </div>
                    <div className={styles.featureGrid}>
                        {cases.map((c, i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureCardIcon}>🏙️</div>
                                <h3 className={styles.featureCardTitle}>{c.name}</h3>
                                <p className={styles.featureCardDesc}>{c.desc}</p>
                            </div>
                        ))}
                    </div>
                    <p style={{ 
                        textAlign: 'center', 
                        marginTop: '48px', 
                        color: '#64748b', 
                        fontSize: '17px', 
                        fontWeight: '500' 
                    }}>
                        {t('cases_conclusion')}
                    </p>
                </div>
            </section>

            {/* Integration Section */}
            <section className={styles.section}>
                <div className={styles.sectionContainer}>
                    <div style={{
                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                        padding: '60px',
                        borderRadius: '32px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '48px',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>
                                {t('integration_title')}
                            </h2>
                            <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>
                                {t('integration_desc')}
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {integrationItems.map((item, i) => (
                                    <li key={i} style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '12px', 
                                        marginBottom: '16px',
                                        color: '#334155',
                                        fontWeight: '500'
                                    }}>
                                        <span style={{ color: '#3b82f6', fontSize: '18px' }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ marginTop: '24px', fontSize: '15px', color: '#94a3b8', fontStyle: 'italic' }}>
                                {t('integration_footer')}
                            </p>
                        </div>
                        <div style={{
                            background: '#ffffff',
                            padding: '40px',
                            borderRadius: '24px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                        }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>
                                {t('choice_title')}
                            </h3>
                            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '24px' }}>
                                {t('choice_desc')}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{
                                        padding: '16px',
                                        background: '#f8fafc',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <span style={{ color: '#0f172a', fontWeight: '600' }}>
                                            {t(`choice_item_${i}`)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingPage>
    );
}

