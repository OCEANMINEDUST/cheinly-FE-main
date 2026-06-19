import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { DisputesList } from "@/pages/shared/DisputesList";

export default function BuyerDisputes() {
  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />
      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8">
        <DisputesList role="buyer" />
      </main>
      <BuyerFooter variant="dashboard" />
    </div>
  );
}
