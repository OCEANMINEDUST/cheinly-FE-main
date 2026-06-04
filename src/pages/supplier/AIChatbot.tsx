import { SupplierShell } from "@/components/supplier/SupplierShell";
import AIChatbotPage from "@/pages/shared/AIChatbotPage";

export default function SupplierAIChatbot() {
  return (
    <SupplierShell>
      <AIChatbotPage role="supplier" />
    </SupplierShell>
  );
}
