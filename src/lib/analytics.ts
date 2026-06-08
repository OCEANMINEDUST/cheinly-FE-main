type EventName =
  | "more_from_seller_click"
  | "view_all_products_click"
  | "seller_product_click";

type EventPayload = Record<string, string | number | boolean | undefined>;

type DataLayerEntry =
  | Record<string, string | number | boolean | undefined>
  | Parameters<NonNullable<Window["gtag"]>>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: ["js", Date] | ["config", string] | ["event", EventName, EventPayload]) => void;
  }
}

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
let ga4Initialized = false;

const getDataLayer = () => {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

function gtag(...args: Parameters<NonNullable<Window["gtag"]>>) {
  getDataLayer().push(args);
}

const loadGa4Script = (measurementId: string) => {
  if (document.querySelector(`script[data-ga4-measurement-id="${measurementId}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.ga4MeasurementId = measurementId;
  document.head.appendChild(script);
};

export function initGA4(measurementId = GA4_MEASUREMENT_ID) {
  getDataLayer();

  if (!measurementId || ga4Initialized) {
    return;
  }

  ga4Initialized = true;
  window.gtag = window.gtag || gtag;
  loadGa4Script(measurementId);
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
}

export function trackEvent(name: EventName, payload: EventPayload = {}) {
  const eventPayload = {
    timestamp: new Date().toISOString(),
    page: window.location.pathname + window.location.search,
    ...payload,
  };

  const dataLayerPayload = {
    event: name,
    ...eventPayload,
  };

  // Console log for development visibility
  console.log("[Analytics]", dataLayerPayload);

  getDataLayer().push(dataLayerPayload);

  if (typeof window.gtag === "function") {
    window.gtag("event", name, eventPayload);
  }
}
