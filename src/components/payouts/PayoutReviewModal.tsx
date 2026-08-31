"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api, PayoutView } from '@/lib/api';

interface PayoutReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    payout: PayoutView | null;
    accessToken: string;
    onSuccess: () => void;
}

export default function PayoutReviewModal({ isOpen, onClose, payout, accessToken, onSuccess }: PayoutReviewModalProps) {
    const t = useTranslations('PayoutReview');
    const tCommon = useTranslations('Common');
    const [loading, setLoading] = useState(false);
    const [reviewStatus, setReviewStatus] = useState<'SUCCESS' | 'FAILED'>('SUCCESS');
    const [rejectedReason, setRejectedReason] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !payout) return null;

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.payouts.reviewPlatformPayout(payout.id, {
                reviewStatus: reviewStatus,
                rejectedReason: reviewStatus === 'FAILED' ? rejectedReason : null
            }, accessToken);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error("Failed to review platform payout:", err);
            setError(err instanceof Error ? err.message : 'Review failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div style={{
                backgroundColor: 'white', padding: '2rem', borderRadius: '0.75rem', width: '500px', maxWidth: '95vw',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', color: '#94a3b8', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                    <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>{t('review_modal.title')}</h2>
                
                <div style={{ marginBottom: '1.5rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9' }}>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                        {t('review_modal.payout_id')}: <span style={{ color: '#0f172a', fontWeight: 600 }}>{payout.id}</span>
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
                        {t('review_modal.amount')}: <span style={{ color: '#0f172a', fontWeight: 600 }}>{payout.totalAmount.toLocaleString()}</span>
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                        {t('headers.payee')}: <span style={{ color: '#0f172a', fontWeight: 600 }}>{payout.payeeAccountHolder} ({payout.payeeAccountNumber})</span>
                    </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>{t('review_modal.decision')}</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setReviewStatus('SUCCESS')}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: `2px solid ${reviewStatus === 'SUCCESS' ? '#10b981' : '#e2e8f0'}`,
                                backgroundColor: reviewStatus === 'SUCCESS' ? '#ecfdf5' : 'white', color: reviewStatus === 'SUCCESS' ? '#10b981' : '#64748b',
                                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {t('review_modal.pass')}
                        </button>
                        <button
                            onClick={() => setReviewStatus('FAILED')}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: `2px solid ${reviewStatus === 'FAILED' ? '#ef4444' : '#e2e8f0'}`,
                                backgroundColor: reviewStatus === 'FAILED' ? '#fef2f2' : 'white', color: reviewStatus === 'FAILED' ? '#ef4444' : '#64748b',
                                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {t('review_modal.fail')}
                        </button>
                    </div>
                </div>

                {reviewStatus === 'FAILED' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>{t('review_modal.reason')}</label>
                        <textarea
                            value={rejectedReason}
                            onChange={(e) => setRejectedReason(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minHeight: '100px', outline: 'none', resize: 'vertical'
                            }}
                            placeholder={t('review_modal.reason_placeholder')}
                        />
                        {!rejectedReason && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{t('review_modal.reason_required')}</p>}
                    </div>
                )}

                {error && (
                    <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '500', border: 'none', cursor: 'pointer' }}
                    >
                        {tCommon('cancel')}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || (reviewStatus === 'FAILED' && !rejectedReason)}
                        style={{
                            padding: '0.625rem 1.25rem', borderRadius: '0.5rem', 
                            backgroundColor: reviewStatus === 'SUCCESS' ? '#10b981' : '#ef4444', 
                            color: 'white', fontWeight: '600', border: 'none', 
                            cursor: (loading || (reviewStatus === 'FAILED' && !rejectedReason)) ? 'not-allowed' : 'pointer',
                            opacity: (loading || (reviewStatus === 'FAILED' && !rejectedReason)) ? 0.6 : 1,
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? tCommon('loading') : tCommon('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}
