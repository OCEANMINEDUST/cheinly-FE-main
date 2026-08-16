import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { flowNav } from "@/components/marketplace/flowStructure";
import BuyerAccountSettings from "@/pages/buyer/AccountSettings";
import { DisputesList } from "@/pages/shared/DisputesList";

describe("role navigation, buyer settings, and disputes", () => {
  it("limits seller and supplier primary nav to overview, transactions, orders, and disputes", () => {
    expect(flowNav("seller").map((link) => link.label)).toEqual(["Overview", "Transactions", "Orders", "Disputes"]);
    expect(flowNav("supplier").map((link) => link.label)).toEqual(["Overview", "Transactions", "Orders", "Disputes"]);
  });

  it("renders buyer settings sections without exposing KYC as a main settings section", () => {
    render(
      <MemoryRouter>
        <BuyerAccountSettings />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Buyer Settings" })).toBeTruthy();
    [
      "Profile Information",
      "Security",
      "Payment Methods",
      "Notifications",
      "Preferences",
      "Help & Support",
      "Legal",
      "Account Management",
    ].forEach((heading) => expect(screen.getAllByText(heading).length).toBeGreaterThan(0));
    expect(screen.queryByRole("heading", { name: /KYC & Verification/i })).toBeNull();
  });

  it("lists disputes from transactions and links each case into its workflow", () => {
    render(
      <MemoryRouter>
        <DisputesList role="seller" />
      </MemoryRouter>,
    );

    expect(screen.getByText("Disputes from transactions")).toBeTruthy();
    expect(screen.getByText("TXN-9A82F1")).toBeTruthy();
    expect(screen.getAllByRole("link", { name: /Continue/i })[0]).toHaveAttribute("href", "/seller/dispute?caseId=DSP-SELL-2041");
  });
});
