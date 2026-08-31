"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { api, PayoutApplicationView } from '@/lib/api';

interface PayoutAuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: PayoutApplicationView | null;
    accessToken: string;
    onSuccess: () => void;
}

export default function PayoutAuditModal({ isOpen, onClose, application, accessToken, onSuccess }: PayoutAuditModalProps) {
    const t = useTranslations('PayoutAudit');
    const tCommon = useTranslations('Common');
    const [loading, setLoading] = useState(false);
    const [auditStatus, setAuditStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
    const [rejectedReason, setRejectedReason] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !application) return null;

    const handleConfirm = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.payouts.auditApplication(application.id, {
                approvalStatus: auditStatus,
                rejectedReason: auditStatus === 'REJECTED' ? rejectedReason : null
            }, accessToken);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error("Failed to audit payout application:", err);
            setError(err instanceof Error ? err.message : 'Audit failed');
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

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>{t('audit_modal.title')}</h2>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        {t('audit_modal.application_id')}: <span style={{ color: '#0f172a', fontWeight: 600 }}>{application.orderId}</span>
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {t('audit_modal.amount')}: <span style={{ color: '#0f172a', fontWeight: 600 }}>{application.totalAmount.toLocaleString()}</span>
                    </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>{t('audit_modal.decision')}</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => setAuditStatus('APPROVED')}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: `2px solid ${auditStatus === 'APPROVED' ? '#10b981' : '#e2e8f0'}`,
                                backgroundColor: auditStatus === 'APPROVED' ? '#ecfdf5' : 'white', color: auditStatus === 'APPROVED' ? '#10b981' : '#64748b',
                                fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            {t('audit_modal.approve')}
                        </button>
                        <button
                            onClick={() => setAuditStatus('REJECTED')}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: `2px solid ${auditStatus === 'REJECTED' ? '#ef4444' : '#e2e8f0'}`,
                                backgroundColor: auditStatus === 'REJECTED' ? '#fef2f2' : 'white', color: auditStatus === 'REJECTED' ? '#ef4444' : '#64748b',
                                fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            {t('audit_modal.reject')}
                        </button>
                    </div>
                </div>

                {auditStatus === 'REJECTED' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#475569' }}>{t('audit_modal.reason')}</label>
                        <textarea
                            value={rejectedReason}
                            onChange={(e) => setRejectedReason(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', minHeight: '100px', outline: 'none'
                            }}
                            placeholder={t('audit_modal.reason_placeholder')}
                        />
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
                        disabled={loading || (auditStatus === 'REJECTED' && !rejectedReason)}
                        style={{
                            padding: '0.625rem 1.25rem', borderRadius: '0.5rem', 
                            backgroundColor: auditStatus === 'APPROVED' ? '#10b981' : '#ef4444', 
                            color: 'white', fontWeight: '500', border: 'none', 
                            cursor: (loading || (auditStatus === 'REJECTED' && !rejectedReason)) ? 'not-allowed' : 'pointer',
                            opacity: (loading || (auditStatus === 'REJECTED' && !rejectedReason)) ? 0.6 : 1
                        }}
                    >
                        {loading ? tCommon('loading') : tCommon('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
}
