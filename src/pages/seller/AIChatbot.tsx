import { SellerShell } from "@/components/seller/SellerShell";
import AIChatbotPage from "@/pages/shared/AIChatbotPage";

export default function SellerAIChatbot() {
  return (
    <SellerShell>
      <AIChatbotPage role="seller" />
    </SellerShell>
  );
}
