import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { getMoreFromSellerProducts } from "@/lib/storefront";
import ProductPublic from "@/pages/store/ProductPublic";
import SellerCatalog from "@/pages/buyer/SellerCatalog";

describe("more from this seller discovery", () => {
  it("selects 3 to 6 active products from the same seller and excludes the current product", () => {
    const recommendations = getMoreFromSellerProducts("globalsneakers", "PRD_83921");

    expect(recommendations.length).toBeGreaterThanOrEqual(3);
    expect(recommendations.length).toBeLessThanOrEqual(6);
    expect(recommendations.some((product) => product.id === "PRD_83921")).toBe(false);
    expect(recommendations.every((product) => product.sellerUsername === "globalsneakers")).toBe(true);
    expect(recommendations.slice(0, -1).every((product) => product.inStock)).toBe(true);
  });

  it("shows a lightweight More From This Seller section on the public product invite page", () => {
    render(
      <MemoryRouter initialEntries={["/p/PRD_83921"]}>
        <Routes>
          <Route path="/p/:productId" element={<ProductPublic />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("More From This Seller")).toBeTruthy();
    expect(screen.getByText("Sold by Global Sneakers Ltd.")).toBeTruthy();
    expect(screen.getByRole("link", { name: /View All Products/i })).toHaveAttribute("href", "/buyer/seller/globalsneakers");
    expect(screen.getAllByRole("link", { name: "View Product" })).toHaveLength(6);
  });

  it("renders seller catalog name, search, product count, and product grid", () => {
    render(
      <MemoryRouter initialEntries={["/buyer/seller/globalsneakers"]}>
        <Routes>
          <Route path="/buyer/seller/:username" element={<SellerCatalog />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Global Sneakers Ltd." })).toBeTruthy();
    expect(screen.getByPlaceholderText("Search products…")).toBeTruthy();
    expect(screen.getByText("7 active products")).toBeTruthy();
    expect(screen.getAllByText(/In stock|Restocking/).length).toBeGreaterThanOrEqual(6);
  });
});
