"use client";
import { useTranslations } from 'next-intl';
import MarketingPage from '@/components/marketing/MarketingPage';

export default function ArchitectureContent() {
    const t = useTranslations('Pages.architecture');
    const tc = useTranslations('Pages.common');

    const features = [
        { icon: '⚙️', title: 'Microservices Architecture', desc: 'Loosely coupled services communicating via event-driven messaging. Each service owns its data and can be deployed independently.' },
        { icon: '☸️', title: 'Kubernetes Orchestration', desc: 'Production workloads run on K8s with auto-scaling, rolling updates, and self-healing. Support for multi-region deployments.' },
        { icon: '⚡', title: 'High Concurrency Design', desc: 'Async queue-based peak shaving with sequential write for hot-spot accounts. Handles 10,000+ TPS per node.' },
        { icon: '🔄', title: 'Event-Driven Processing', desc: 'All state transitions produce domain events consumed by downstream services for real-time reconciliation and reporting.' },
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
