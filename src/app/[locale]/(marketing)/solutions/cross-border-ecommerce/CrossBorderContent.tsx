"use client";
import { useTranslations } from 'next-intl';
import MarketingPage from '@/components/marketing/MarketingPage';
import styles from '@/components/marketing/marketing.module.css';

const TECH_STACK = ['Saleor', 'Next.js', 'Stripe', 'PayPal', 'Webhook', 'OpenAPI', 'Docker'];

export default function CrossBorderContent() {
    const t = useTranslations('Pages.case_studies.micselect');

    return (
        <MarketingPage
            badge={t('badge')}
            heroTitle={t('title')}
            heroDesc={t('subtitle')}
            ctaTitle={t('cta_title')}
            ctaDesc={t('cta_desc')}
            ctaButtonText={t('cta_title')}
        >
            {/* Tech Stack Badges */}
            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', marginTop: '-100px', paddingBottom: '60px' }}>
                <div className={styles.techStackRow}>
                    {TECH_STACK.map((tech) => (
                        <span key={tech} className={styles.techBadge}>{tech}</span>
                    ))}
                </div>
            </section>

            {/* Article Content */}
            <section className={styles.section}>
                <div className={styles.articleLayout}>

                    {/* ① Client Background */}
                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>{t('background_eyebrow')}</span>
                        <h2 className={styles.articleTitle}>MicSelect</h2>
                        <p className={styles.articleText}>{t('background_text')}</p>
                        <p className={styles.articleText} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <a
                                href="https://www.micselect.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}
                            >
                                {t('background_link_text')}
                            </a>
                            <a
                                href="https://www.micselect.com/cn/solutions"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}
                            >
                                {t('background_solutions_link_text')}
                            </a>
                        </p>
                    </article>

                    {/* ② Challenges */}
                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>{t('challenges_eyebrow')}</span>
                        <h2 className={styles.articleTitle}>{t('challenges_eyebrow')}</h2>
                        <ul className={styles.articleList}>
                            {(t.raw('challenges_items') as string[]).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </article>

                    {/* ③ FilixPay Solution */}
                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>{t('solution_eyebrow')}</span>
                        <h2 className={styles.articleTitle}>FilixPay {t('solution_eyebrow')}</h2>
                        <p className={styles.articleText}>{t('solution_intro')}</p>
                        <ul className={styles.articleList}>
                            {(t.raw('solution_items') as string[]).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </article>

                    {/* ④ Architecture */}
                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>{t('architecture_eyebrow')}</span>
                        <h2 className={styles.articleTitle}>{t('architecture_eyebrow')}</h2>

                        <div className={styles.archDiagram}>
                            {/* Saleor */}
                            <div className={styles.archNode}>
                                <div className={styles.archNodeName}>{t('arch_saleor')}</div>
                                <div className={styles.archLabel}>{t('arch_saleor_label')}</div>
                            </div>

                            <div className={styles.archArrow} />

                            {/* FilixPay Payment App */}
                            <div className={`${styles.archNode} ${styles.archNodeHighlight}`}>
                                <div className={styles.archNodeName}>{t('arch_payment_app')}</div>
                                <div className={styles.archLabel}>{t('arch_payment_app_label')}</div>
                            </div>

                            <div className={styles.archArrow} />

                            {/* FilixPay Gateway */}
                            <div className={`${styles.archNode} ${styles.archNodeHighlight}`}>
                                <div className={styles.archNodeName}>{t('arch_gateway')}</div>
                                <div className={styles.archLabel}>{t('arch_gateway_label')}</div>
                            </div>

                            <div className={styles.archArrow} />

                            {/* Payment Channels */}
                            <div className={styles.archRow}>
                                <div className={styles.archNode}>
                                    <div className={styles.archNodeName}>Stripe</div>
                                    <div className={styles.archLabel}>{t('arch_channels_label')}</div>
                                </div>
                                <div className={styles.archNode}>
                                    <div className={styles.archNodeName}>PayPal</div>
                                    <div className={styles.archLabel}>{t('arch_channels_label')}</div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* ⑤ Results */}
                    <article className={styles.articleBlock}>
                        <span className={styles.articleEyebrow}>{t('results_eyebrow')}</span>
                        <h2 className={styles.articleTitle}>{t('results_eyebrow')}</h2>
                        <ul className={styles.articleList}>
                            {(t.raw('results_items') as string[]).map((item: string, i: number) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </article>

                </div>
            </section>
        </MarketingPage>
    );
}
