import { SellerShell } from "@/components/seller/SellerShell";
import { DisputesList } from "@/pages/shared/DisputesList";

export default function SellerDisputes() {
  return (
    <SellerShell>
      <DisputesList role="seller" />
    </SellerShell>
  );
}
