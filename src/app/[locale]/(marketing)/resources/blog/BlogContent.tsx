"use client";
import { useTranslations } from 'next-intl';
import styles from '@/components/marketing/marketing.module.css';

export default function BlogContent() {
    const t = useTranslations('Pages.blog');
    const tc = useTranslations('Pages.common');

    // Currently next-intl raw mapping is best for arrays of objects
    // For simplicity with the existing structure, we'll manually define keys if needed 
    // but here we can just use the indices since it's a fixed list for now.
    const postsCount = 2; // We can make this dynamic if needed

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
                        {Array.from({ length: postsCount }).map((_, i) => (
                            <a 
                                key={i} 
                                href={t(`posts.${i}.link`)} 
                                target="_blank" 
                                className={styles.featureCard}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className={styles.featureCardIcon}>📝</div>
                                <h3 className={styles.featureCardTitle}>{t(`posts.${i}.title`)}</h3>
                                <p className={styles.featureCardDesc}>{t(`posts.${i}.desc`)}</p>
                                <div className={styles.btnSecondary} style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '8px 16px', fontSize: '14px' }}>
                                    {tc('learn_more')}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
