"use client";
import { useTranslations } from 'next-intl';
import styles from '@/components/marketing/marketing.module.css';

export default function DownloadsContent() {
    const t = useTranslations('Pages.downloads');

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
                    <div className={styles.downloadGrid}>
                        <a href="/deploy/deployment.md" target="_blank" className={styles.downloadCard}>
                            <div className={styles.downloadCardIcon}>📘</div>
                            <div className={styles.downloadCardTitle}>{t('items.deploy_doc.title')}</div>
                            <div className={styles.downloadCardDesc}>{t('items.deploy_doc.desc')}</div>
                        </a>
                        <a href="/legal/source-code-license-agreement.txt" target="_blank" className={styles.downloadCard}>
                            <div className={styles.downloadCardIcon}>📋</div>
                            <div className={styles.downloadCardTitle}>{t('items.license_sample.title')}</div>
                            <div className={styles.downloadCardDesc}>{t('items.license_sample.desc')}</div>
                        </a>
                        <a href="/openapi/v1/swagger" target="_blank" className={styles.downloadCard}>
                            <div className={styles.downloadCardIcon}>📄</div>
                            <div className={styles.downloadCardTitle}>{t('items.api_spec.title')}</div>
                            <div className={styles.downloadCardDesc}>{t('items.api_spec.desc')}</div>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
