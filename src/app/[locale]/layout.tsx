import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import Providers from "../providers";
import "../globals.css";
import "antd/dist/reset.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

import { getTranslations } from "next-intl/server";
import { getEnv } from "@/lib/env";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Layout" });

  return {
    metadataBase: new URL(getEnv().siteUrl),
    title: t("title"),
    description: t("description"),
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/icon.png",
    }
  };
}

import Script from "next/script";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'pt'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Handle RTL for Arabic
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var c=localStorage.getItem("sidebarCollapsed")==="true";document.documentElement.dataset.sidebarCollapsed=c?"1":"0";}catch(e){document.documentElement.dataset.sidebarCollapsed="0";}',
          }}
        />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DBNNGE4RV5" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DBNNGE4RV5');
          `}
        </Script>
        <Script id="baidu-analytics">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?9c9f0c91a07d72742cdabfb4dd9ce4ed";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable}`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
