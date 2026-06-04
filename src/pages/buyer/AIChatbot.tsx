import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import AIChatbotPage from "@/pages/shared/AIChatbotPage";

export default function BuyerAIChatbot() {
  return (
    <div className="flex min-h-screen flex-col bg-background bg-hero">
      <BuyerHeader variant="dashboard" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 lg:px-8">
        <AIChatbotPage role="buyer" />
      </main>
      <BuyerFooter />
    </div>
  );
}
