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
