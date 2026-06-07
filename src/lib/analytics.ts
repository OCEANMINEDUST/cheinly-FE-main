type EventName =
  | "more_from_seller_click"
  | "view_all_products_click"
  | "seller_product_click";

type EventPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: EventName, payload: EventPayload = {}) {
  const fullPayload = {
    event: name,
    timestamp: new Date().toISOString(),
    page: window.location.pathname + window.location.search,
    ...payload,
  };

  // Console log for development visibility
  // eslint-disable-next-line no-console
  console.log("[Analytics]", fullPayload);

  // Ready for production analytics provider (e.g., Google Analytics, Mixpanel, Segment)
  // @ts-expect-error — allow gtag injection
  if (typeof window.gtag === "function") {
    // @ts-expect-error
    window.gtag("event", name, payload);
  }

  // @ts-expect-error — allow dataLayer push for GTM
  if (typeof window.dataLayer !== "undefined") {
    // @ts-expect-error
    window.dataLayer.push(fullPayload);
  }
}
