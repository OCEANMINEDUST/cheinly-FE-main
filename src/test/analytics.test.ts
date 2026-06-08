import { beforeEach, describe, expect, it, vi } from "vitest";
import { initGA4, trackEvent } from "@/lib/analytics";

describe("analytics", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    window.dataLayer = [];
    window.gtag = undefined;
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("pushes tracked events to the GTM dataLayer", () => {
    trackEvent("more_from_seller_click", {
      seller_username: "ada",
      product_id: "sku-1",
    });

    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer?.[0]).toMatchObject({
      event: "more_from_seller_click",
      page: "/",
      seller_username: "ada",
      product_id: "sku-1",
    });
  });

  it("sends the same tracked event to GA4 through gtag when configured", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent("view_all_products_click", {
      seller_username: "ada",
      product_count: 4,
    });

    expect(gtag).toHaveBeenCalledWith(
      "event",
      "view_all_products_click",
      expect.objectContaining({
        page: "/",
        seller_username: "ada",
        product_count: 4,
      }),
    );
  });

  it("loads and configures GA4 when a measurement ID is provided", () => {
    initGA4("G-TEST123");

    expect(window.gtag).toEqual(expect.any(Function));
    expect(document.querySelector('script[data-ga4-measurement-id="G-TEST123"]')).toBeTruthy();
    expect(window.dataLayer?.length).toBeGreaterThanOrEqual(2);
  });
});
