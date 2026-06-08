import { SupplierShell } from "@/components/supplier/SupplierShell";
import { DisputesList } from "@/pages/shared/DisputesList";

export default function SupplierDisputes() {
  return (
    <SupplierShell>
      <DisputesList role="supplier" />
    </SupplierShell>
  );
}
