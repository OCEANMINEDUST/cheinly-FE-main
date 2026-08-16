import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  buildCanonicalUrl,
  getSeoTemplate,
  organizationJsonLd,
} from "@/lib/seo";

const setMeta = (selector: string, attribute: "name" | "property", value: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const setJsonLd = (id: string, payload: Record<string, unknown>) => {
  let element = document.getElementById(id) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(payload);
};

export const SEOManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const template = getSeoTemplate(pathname);
    const canonicalUrl = buildCanonicalUrl(template.path);
    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: template.title,
      description: template.description,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: buildCanonicalUrl("/"),
      },
    };

    document.title = template.title;
    setMeta('meta[name="description"]', "name", "description", template.description);
    setMeta('meta[name="robots"]', "name", "robots", template.robots ?? "index,follow");
    setMeta('meta[property="og:title"]', "property", "og:title", template.title);
    setMeta('meta[property="og:description"]', "property", "og:description", template.description);
    setMeta('meta[property="og:type"]', "property", "og:type", template.ogType ?? "website");
    setMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE_NAME);
    setMeta('meta[property="og:image"]', "property", "og:image", DEFAULT_OG_IMAGE);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:site"]', "name", "twitter:site", "@Cheinly");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", template.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", template.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", DEFAULT_OG_IMAGE);
    setCanonical(canonicalUrl);
    setJsonLd("organization-json-ld", organizationJsonLd);
    setJsonLd("webpage-json-ld", pageJsonLd);
  }, [pathname]);

  return null;
};
