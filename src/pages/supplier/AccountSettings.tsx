import { SupplierShell } from "@/components/supplier/SupplierShell";
import AccountSettings from "@/pages/shared/AccountSettings";

export default function SupplierAccountSettings() {
  return (
    <SupplierShell>
      <AccountSettings role="supplier" />
    </SupplierShell>
  );
}
