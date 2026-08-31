import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import SiteNavbar from '@/components/marketing/SiteNavbar';
import SiteFooter from '@/components/marketing/SiteFooter';
import { getEnv } from '@/lib/env';

export default async function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (!getEnv().enableMarketing) {
        const locale = await getLocale();
        redirect(`/${locale}/dashboard`);
    }

    return (
        <>
            <SiteNavbar />
            <main>{children}</main>
            <SiteFooter />
        </>
    );
}
