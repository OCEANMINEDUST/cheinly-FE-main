import { ChangeEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ImagePlus, ShieldAlert, Upload, X } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { multiItemVerification, reportIssueTypes } from "@/lib/orderMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_PHOTOS = 3;

const BuyerReportIssue = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orderId = params.get("orderId") ?? "ORD-521-450";
  const productId = params.get("productId") ?? "MD-9521X";
  const itemId = params.get("itemId");
  const baseQuery = useMemo(() => new URLSearchParams({ productId, orderId, entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [orderId, productId, params]);

  const focusedItem = useMemo(() => multiItemVerification.find((item) => item.id === itemId) ?? multiItemVerification[0], [itemId]);

  const [issueType, setIssueType] = useState<string>("damaged");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const slots = MAX_PHOTOS - photos.length;
    const accepted = files.slice(0, slots).map((file) => URL.createObjectURL(file));
    setPhotos((current) => [...current, ...accepted]);
    if (files.length > slots) toast.message(`Only ${MAX_PHOTOS} photos allowed — extras were skipped.`);
    event.target.value = "";
  };

  const removePhoto = (index: number) => setPhotos((current) => current.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (description.trim().length < 20) {
      toast.error("Add at least 20 characters describing the issue.");
      return;
    }
    if (!photos.length) {
      toast.error("Upload at least 1 photo as proof.");
      return;
    }
    toast.success("Issue reported — escrow release is paused.");
    navigate(`/buyer/dispute?${baseQuery}&source=report`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-5xl px-5 py-8 lg:px-8 space-y-6">
        <div className="space-y-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to verification
          </button>
          <h1 className="font-display text-4xl text-foreground">Report an Issue</h1>
          <p className="text-sm text-muted-foreground">Filing a report on <span className="font-medium text-foreground">{focusedItem.name}</span> from order {orderId}.</p>
        </div>

        <Alert className="border-gold/30 bg-gold/10 text-foreground [&>svg]:text-gold">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Reporting pauses the escrow release</AlertTitle>
          <AlertDescription>Funds for this item stay locked until the seller responds, you withdraw the report, or admin resolves it.</AlertDescription>
        </Alert>

        <Card className="shadow-card">
          <CardContent className="space-y-5 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Step 1</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Select the type of problem</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {reportIssueTypes.map((type) => (
                <button key={type.id} type="button" onClick={() => setIssueType(type.id)} className={cn("rounded-lg border p-4 text-left transition-colors", issueType === type.id ? "border-primary/40 bg-primary/10" : "border-border bg-card hover:bg-secondary/30")}>
                  <p className="font-medium text-foreground">{type.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{type.hint}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Step 2</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Describe what happened</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value.slice(0, 800))} placeholder="Tell us what's wrong, when you noticed, and what would resolve it." className="min-h-[160px] resize-none" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Minimum 20 characters</span>
                <span>{description.length} / 800</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Step 3</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Upload proof of issue</h2>
              <p className="mt-1 text-sm text-muted-foreground">Up to {MAX_PHOTOS} photos. Clear, well-lit images speed up resolution.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {photos.map((photo, index) => (
                <div key={photo} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
                  <img src={photo} alt={`Proof ${index + 1}`} className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removePhoto(index)} className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm hover:bg-background" aria-label="Remove photo">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS ? (
                <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/20 p-4 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary/35">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"><ImagePlus className="h-4 w-4" /></div>
                  <p className="font-medium text-foreground">Add photo</p>
                  <span className="inline-flex items-center gap-1 text-xs"><Upload className="h-3 w-3" /> {MAX_PHOTOS - photos.length} slot{MAX_PHOTOS - photos.length === 1 ? "" : "s"} left</span>
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={handlePhotos} />
                </label>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
              <p>Once submitted, this report is shared with the seller and added to your dispute timeline.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate(-1)} className="border-border bg-card hover:bg-secondary">Cancel</Button>
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Report</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

export default BuyerReportIssue;