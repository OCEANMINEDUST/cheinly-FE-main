import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, FileText, Pencil } from "lucide-react";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getDocuments, isOnboardingComplete, saveDocuments, updateRider } from "@/lib/riderMock";
import { toast } from "sonner";

const RiderDocumentReview = () => {
  const navigate = useNavigate();
  const docs = getDocuments();

  if (!isOnboardingComplete(docs)) {
    navigate("/rider/onboarding", { replace: true });
    return null;
  }

  const submit = () => {
    saveDocuments({ ...docs, submittedAt: new Date().toISOString() });
    updateRider({ status: "pending" });
    toast.success("Documents submitted for review.");
    navigate("/rider/approval", { replace: true });
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate("/rider/onboarding")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Final review</p>
            <p className="font-display text-lg leading-tight text-foreground">Confirm your documents</p>
          </div>
        </div>
      }
    >
      <div className="space-y-5 px-5 py-6">
        <p className="text-sm text-muted-foreground">Make sure every detail is sharp and readable. Tap any image to retake it.</p>

        <ReviewTile label="Driver's license — front" url={docs.licenseFrontUrl!} onEdit={() => navigate("/rider/onboarding")} />
        <ReviewTile label="Driver's license — back" url={docs.licenseBackUrl!} onEdit={() => navigate("/rider/onboarding")} />
        <ReviewTile label="Vehicle registration" url={docs.registrationUrl!} onEdit={() => navigate("/rider/onboarding")} />

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <FileText className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Heads up</p>
              <p className="text-xs text-muted-foreground">Once submitted you can't edit these until review is complete (usually under 30 minutes).</p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={submit} className="h-12 w-full rounded-xl text-base">
          <Check className="mr-2 h-4 w-4" /> Submit for review
        </Button>
      </div>
    </RiderShell>
  );
};

const ReviewTile = ({ label, url, onEdit }: { label: string; url: string; onEdit: () => void }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <button onClick={onEdit} className="flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline">
        <Pencil className="h-3 w-3" /> Retake
      </button>
    </div>
    <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
      <img src={url} alt={label} className="aspect-[16/10] w-full object-cover" />
    </div>
  </div>
);

export default RiderDocumentReview;