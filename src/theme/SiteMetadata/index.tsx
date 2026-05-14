import React, { type ReactNode } from "react";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { PageMetadata, useThemeConfig } from "@docusaurus/theme-common";
import { DEFAULT_SEARCH_TAG, keyboardFocusedClassName } from "@docusaurus/theme-common/internal";
import { useLocation } from "@docusaurus/router";
import { applyTrailingSlash } from "@docusaurus/utils-common";
import SearchMetadata from "@theme/SearchMetadata";

// Swizzle of @theme/SiteMetadata that drops the upstream <AlternateLangHeaders>.
// Docusaurus emits `<link rel="alternate" hreflang="…">` for every locale plus
// `x-default` unconditionally; on a single-locale site both point at the same
// URL as the canonical and add no signal for search engines. They also inherit
// the trailing-slash shape from the React Router pathname, mismatching the
// slashless canonical emitted by src/theme/DocItem/Metadata/index.tsx (RDoc-3785).
// We keep the canonical, og:url, og:locale, and SearchMetadata blocks intact —
// only the hreflang links are dropped. Restore <AlternateLangHeaders/> from
// upstream if a second i18n locale is ever added.

function useDefaultCanonicalUrl() {
    const {
        siteConfig: { url: siteUrl, baseUrl, trailingSlash },
    } = useDocusaurusContext();
    const { pathname } = useLocation();
    const canonicalPathname = applyTrailingSlash(useBaseUrl(pathname), {
        trailingSlash,
        baseUrl,
    });
    return siteUrl + canonicalPathname;
}

function CanonicalUrlHeaders({ permalink }: { permalink?: string }): ReactNode {
    const {
        siteConfig: { url: siteUrl },
    } = useDocusaurusContext();
    const defaultCanonicalUrl = useDefaultCanonicalUrl();
    const canonicalUrl = permalink ? `${siteUrl}${permalink}` : defaultCanonicalUrl;
    return (
        <Head>
            <meta property="og:url" content={canonicalUrl} />
            <link rel="canonical" href={canonicalUrl} />
        </Head>
    );
}

function OgLocaleHeader(): ReactNode {
    const {
        i18n: { currentLocale, localeConfigs },
    } = useDocusaurusContext();
    // BCP 47 (en-US) → Open Graph locale (en_US). See https://ogp.me/#optional.
    const ogLocale = localeConfigs[currentLocale]!.htmlLang.replace("-", "_");
    return (
        <Head>
            <meta property="og:locale" content={ogLocale} />
        </Head>
    );
}

export default function SiteMetadata(): ReactNode {
    const {
        i18n: { currentLocale },
    } = useDocusaurusContext();
    const { metadata, image: defaultImage } = useThemeConfig();

    return (
        <>
            <Head>
                <meta name="twitter:card" content="summary_large_image" />
                {/* Keyboard focus class needs to be on <body> at SSR so links
                are outlined when JS is disabled. */}
                <body className={keyboardFocusedClassName} />
            </Head>

            {defaultImage && <PageMetadata image={defaultImage} />}

            <CanonicalUrlHeaders />

            <OgLocaleHeader />

            <SearchMetadata tag={DEFAULT_SEARCH_TAG} locale={currentLocale} />

            {/* A second <Head> here lets react-helmet override defaults set
            in earlier <Head> blocks (e.g. twitter:card). Within a single Head
            the same meta would appear twice instead of overriding. */}
            <Head>
                {metadata.map((metadatum, i) => (
                    <meta key={i} {...metadatum} />
                ))}
            </Head>
        </>
    );
}
