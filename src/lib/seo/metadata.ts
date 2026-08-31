import type { Metadata } from "next";
import { DEFAULT_LOCALE, DEFAULT_OG_IMAGE, LOCALES } from "./constants";

export type PageSeoInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  robots?: Metadata["robots"];
};

function normalizePath(path: string): string {
  if (path === "/" || path === "") {
    return "";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildAlternates(locale: string, path: string) {
  const suffix = normalizePath(path);
  const languages: Record<string, string> = {};

  for (const loc of LOCALES) {
    languages[loc] = `/${loc}${suffix}`;
  }
  languages["x-default"] = `/${DEFAULT_LOCALE}${suffix}`;

  return {
    canonical: `/${locale}${suffix}`,
    languages,
  };
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const { locale, path, title, description, keywords, ogImage, robots } = input;
  const alternates = buildAlternates(locale, path);
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates,
    ...(robots !== undefined && { robots }),
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      locale,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
