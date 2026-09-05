"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { getHelpHref } from "@/content/help/loaders";
import { searchHelpArticles } from "@/content/help/search";
import styles from "./help.module.css";

type Props = {
  locale: string;
};

export default function HelpSearch({ locale }: Props) {
  const t = useTranslations("Help");
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => searchHelpArticles(locale, query),
    [locale, query],
  );

  const trimmed = query.trim();
  const showResults = trimmed.length > 0;

  return (
    <div className={styles.searchWrap}>
      <div className={styles.searchBox}>
        <label className={styles.srOnly} htmlFor="help-search">
          {t("search_placeholder")}
        </label>
        <input
          id="help-search"
          type="search"
          name="q"
          className={styles.searchInput}
          placeholder={t("search_placeholder")}
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-controls={showResults ? "help-search-results" : undefined}
        />
      </div>
      {showResults ? (
        <ul
          id="help-search-results"
          className={styles.searchResults}
          aria-label={t("search_placeholder")}
        >
          {results.length === 0 ? (
            <li className={styles.searchEmpty}>{t("search_no_results")}</li>
          ) : (
            results.map((hit) => (
              <li key={hit.slug}>
                <Link
                  href={getHelpHref(locale, hit.slug)}
                  className={styles.articleLink}
                >
                  <span className={styles.articleTitle}>{hit.title}</span>
                  {hit.description ? (
                    <span className={styles.articleBlurb}>
                      {hit.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
