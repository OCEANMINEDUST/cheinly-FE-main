import { ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Camera, Check, FileText, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getDocuments, saveDocuments, updateRider } from "@/lib/riderMock";
import { toast } from "sonner";

const RiderOnboarding = () => {
  const navigate = useNavigate();
  const initial = getDocuments();
  const [step, setStep] = useState<1 | 2>(1);
  const [licenseFront, setLicenseFront] = useState<string | undefined>(initial.licenseFrontUrl);
  const [licenseBack, setLicenseBack] = useState<string | undefined>(initial.licenseBackUrl);
  const [registration, setRegistration] = useState<string | undefined>(initial.registrationUrl);

  const progress = useMemo(() => {
    const filled = [licenseFront, licenseBack, registration].filter(Boolean).length;
    return (filled / 3) * 100;
  }, [licenseFront, licenseBack, registration]);

  const handlePick = (set: (url: string) => void) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    set(URL.createObjectURL(file));
    event.target.value = "";
  };

  const goNext = () => {
    if (!licenseFront || !licenseBack) {
      toast.error("Upload both sides of your driver's license.");
      return;
    }
    setStep(2);
  };

  const submit = () => {
    if (!registration) {
      toast.error("Upload your vehicle registration.");
      return;
    }
    saveDocuments({ licenseFrontUrl: licenseFront, licenseBackUrl: licenseBack, registrationUrl: registration, submittedAt: new Date().toISOString() });
    updateRider({ status: "pending" });
    toast.success("Documents submitted for review.");
    navigate("/rider/approval", { replace: true });
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => (step === 1 ? navigate("/rider") : setStep(1))}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Step {step} of 2</p>
            <p className="font-display text-lg leading-tight text-foreground">{step === 1 ? "Driver's license" : "Vehicle registration"}</p>
          </div>
        </div>
      }
    >
      <div className="px-5 pt-4">
        <Progress value={progress} className="h-1.5" />
      </div>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5 px-5 py-6">
            <p className="text-sm text-muted-foreground">Upload clear photos of both sides of your valid driver's license.</p>
            <UploadTile label="License — front" caption="Photo of the side with your photo" value={licenseFront} onChange={handlePick(setLicenseFront)} onClear={() => setLicenseFront(undefined)} />
            <UploadTile label="License — back" caption="Photo of the back of the card" value={licenseBack} onChange={handlePick(setLicenseBack)} onClear={() => setLicenseBack(undefined)} />
            <Button onClick={goNext} className="h-12 w-full rounded-xl text-base">
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-5 px-5 py-6">
            <p className="text-sm text-muted-foreground">Upload your vehicle registration document. Make sure the plate number matches your profile.</p>
            <UploadTile label="Vehicle registration" caption="Full document, all four corners visible" value={registration} onChange={handlePick(setRegistration)} onClear={() => setRegistration(undefined)} />
            <Button onClick={submit} className="h-12 w-full rounded-xl text-base">
              Submit for review <Check className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </RiderShell>
  );
};

const UploadTile = ({ label, caption, value, onChange, onClear }: { label: string; caption: string; value?: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; onClear: () => void }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {value ? (
        <button type="button" onClick={onClear} className="text-xs text-muted-foreground underline-offset-2 hover:underline">Replace</button>
      ) : null}
    </div>
    <label className={cn(
      "relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors",
      value ? "border-primary/40 bg-secondary/30" : "border-border bg-muted/40 hover:border-primary/40 hover:bg-secondary/40",
    )}>
      {value ? (
        <img src={value} alt={label} className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Camera className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">Tap to upload</p>
          <p className="text-xs">{caption}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px]"><Upload className="h-3 w-3" /> JPG / PNG up to 10 MB</span>
        </div>
      )}
      <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={onChange} />
    </label>
  </div>
);

export default RiderOnboarding;