import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons', 'lucide-react'],
  },
  async redirects() {
    const locales = 'en|es|fr|de|zh|ja|ko|ar|pt';
    return [
      {
        source: `/:locale(${locales})/solutions/web3-ecommerce`,
        destination: '/:locale/products/crypto-payment',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/solutions/saas-provider`,
        destination: '/:locale/products/payment-splitting',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/solutions/enterprise`,
        destination: '/:locale/solutions/cross-border-ecommerce',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/money/settlement-releases`,
        destination: '/:locale/dashboard/money/settlements',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/money/settlement-releases/:path*`,
        destination: '/:locale/dashboard/money/settlements/:path*',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/money/settlement-statements`,
        destination: '/:locale/dashboard/money/settlements/statements',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/money/settlement-statements/:path*`,
        destination: '/:locale/dashboard/money/settlements/statements/:path*',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/balance`,
        destination: '/:locale/dashboard/money/balance',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/deposits`,
        destination: '/:locale/dashboard/money/money-in',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/payouts/audit`,
        destination: '/:locale/dashboard/money/payouts',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/payouts/review`,
        destination: '/:locale/dashboard/money/payouts',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/payouts`,
        destination: '/:locale/dashboard/money/payouts',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/payout-records`,
        destination: '/:locale/dashboard/money/payouts',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/bank-accounts`,
        destination: '/:locale/dashboard/money/external-accounts',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/crypto-deposit-wallets`,
        destination: '/:locale/dashboard/money/crypto',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/money/money-in/methods`,
        destination: '/:locale/dashboard/money/crypto',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/transfer-records`,
        destination: '/:locale/dashboard/money/transfers',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/credit/adjustment-records`,
        destination: '/:locale/dashboard/credit/limit',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/credit/transactions`,
        destination: '/:locale/dashboard/credit/limit',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/member-credit/adjustment-history`,
        destination: '/:locale/dashboard/member-credit/available-credit',
        permanent: true,
      },
      {
        source: `/:locale(${locales})/dashboard/member-credit/payment-history`,
        destination: '/:locale/dashboard/member-credit/available-credit',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/auth-api/developer/:path*',
        destination: '/api/developer/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
