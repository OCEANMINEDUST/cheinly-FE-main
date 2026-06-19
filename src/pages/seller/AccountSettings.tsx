import { SellerShell } from "@/components/seller/SellerShell";
import AccountSettings from "@/pages/shared/AccountSettings";

export default function SellerAccountSettings() {
  return (
    <SellerShell>
      <AccountSettings role="seller" />
    </SellerShell>
  );
}
