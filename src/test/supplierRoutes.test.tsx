import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { setAccountRole } from "@/lib/accountRole";
import { RoleAccessRoute } from "@/components/shared/RoleAccessRoute";

import SupplierDashboard from "@/pages/supplier/Dashboard";
import SupplierOnboarding from "@/pages/supplier/Onboarding";
import SupplierOrders from "@/pages/supplier/Orders";
import SupplierTransactions from "@/pages/supplier/Transactions";
import SupplierInvite from "@/pages/supplier/Invite";
import SupplierDisputeReview from "@/pages/supplier/DisputeReview";
import SupplierDisputes from "@/pages/supplier/Disputes";
import SupplierReturnTracking from "@/pages/supplier/ReturnTracking";
import SupplierReturnInspection from "@/pages/supplier/ReturnInspection";
import SupplierAccountOverview from "@/pages/supplier/AccountOverview";
import SupplierSettingsKyc from "@/pages/supplier/SettingsKyc";
import SupplierPerformance from "@/pages/supplier/Performance";
import SupplierTierProgress from "@/pages/supplier/TierProgress";
import SupplierMarketLookup from "@/pages/supplier/MarketLookup";
import SupplierAccountSettings from "@/pages/supplier/AccountSettings";
import SupplierAIChatbot from "@/pages/supplier/AIChatbot";

const routes: Array<{ path: string; Component: React.ComponentType }> = [
  { path: "/supplier/dashboard", Component: SupplierDashboard },
  { path: "/supplier/onboarding", Component: SupplierOnboarding },
  { path: "/supplier/orders", Component: SupplierOrders },
  { path: "/supplier/transactions", Component: SupplierTransactions },
  { path: "/supplier/invite/:orderId", Component: SupplierInvite },
  { path: "/supplier/dispute-review", Component: SupplierDisputeReview },
  { path: "/supplier/disputes", Component: SupplierDisputes },
  { path: "/supplier/return-tracking", Component: SupplierReturnTracking },
  { path: "/supplier/return-inspection", Component: SupplierReturnInspection },
  { path: "/supplier/account", Component: SupplierAccountOverview },
  { path: "/supplier/settings-kyc", Component: SupplierSettingsKyc },
  { path: "/supplier/performance", Component: SupplierPerformance },
  { path: "/supplier/tier-progress", Component: SupplierTierProgress },
  { path: "/supplier/market-lookup", Component: SupplierMarketLookup },
  { path: "/supplier/settings", Component: SupplierAccountSettings },
  { path: "/supplier/ai-chatbot", Component: SupplierAIChatbot },
];

const initialFor = (path: string) =>
  path.includes(":orderId") ? path.replace(":orderId", "SUP-1001") : path;

describe("supplier routes", () => {
  beforeEach(() => {
    setAccountRole("supplier");
  });

  for (const { path, Component } of routes) {
    it(`renders ${path} when role=supplier`, () => {
      const initial = initialFor(path);
      const { container } = render(
        <MemoryRouter initialEntries={[initial]}>
          <Routes>
            <Route
              path={path}
              element={
                <RoleAccessRoute required="supplier">
                  <Component />
                </RoleAccessRoute>
              }
            />
            <Route path="/seller/dashboard" element={<div data-testid="seller-redirect" />} />
          </Routes>
        </MemoryRouter>
      );
      expect(container.querySelector('[data-testid="seller-redirect"]')).toBeNull();
      expect(container.textContent?.length ?? 0).toBeGreaterThan(0);
    });
  }

  it("redirects to /seller/dashboard when role=seller", () => {
    setAccountRole("seller");
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/supplier/dashboard"]}>
        <Routes>
          <Route
            path="/supplier/dashboard"
            element={
              <RoleAccessRoute required="supplier">
                <SupplierDashboard />
              </RoleAccessRoute>
            }
          />
          <Route path="/seller/dashboard" element={<div data-testid="seller-redirect" />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByTestId("seller-redirect")).toBeTruthy();
  });
});