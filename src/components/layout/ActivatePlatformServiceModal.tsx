"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '@/lib/api';
import styles from '../orders/CreateOrderModal.module.css';

interface ActivatePlatformServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accessToken: string;
    merchantName: string;
}

export default function ActivatePlatformServiceModal({
    isOpen,
    onClose,
    onSuccess,
    accessToken,
    merchantName
}: ActivatePlatformServiceModalProps) {
    const t = useTranslations('Layout.identity.modal');
    const tCommon = useTranslations('Common');

    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.merchants.createPortalMerchant(accessToken);
            alert(t('success'));
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Failed to activate service');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </button>

                <h2 className={styles.title}>{t('title')}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                    <section>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.375rem' }}>
                            {t('intro_title')}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                            {t('intro')}
                        </p>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.375rem' }}>
                            {t('reason_title')}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                            {t('reason')}
                        </p>
                    </section>

                    <div
                        style={{
                            padding: '0.75rem 0.875rem',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#334155',
                        }}
                    >
                        <span style={{ color: '#64748b' }}>{t('merchant_label')}：</span>
                        {merchantName}
                    </div>

                    <p
                        style={{
                            margin: 0,
                            padding: '0.625rem 0.75rem',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            color: '#1e40af',
                            lineHeight: 1.55,
                        }}
                    >
                        {t('notice')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={styles.footer}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            {tCommon('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={styles.submitButton}
                        >
                            {submitting ? tCommon('loading') : t('submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
