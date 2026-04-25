import { Navigate } from "react-router-dom";
import { getDocuments, getRider, isOnboardingComplete, isRiderActive } from "@/lib/riderMock";
import RiderSignup from "./Signup";

/**
 * Smart entry for the rider app:
 * - Brand new device → show signup form
 * - Started onboarding → resume onboarding
 * - Pending review → approval wall
 * - Approved → dashboard
 */
const RiderEntry = () => {
  const rider = getRider();
  const docs = getDocuments();

  if (isRiderActive(rider)) return <Navigate to="/rider/dashboard" replace />;
  if (rider.status === "pending") return <Navigate to="/rider/approval" replace />;
  if (isOnboardingComplete(docs)) return <Navigate to="/rider/approval" replace />;
  if (rider.status === "new" && (docs.licenseFrontUrl || docs.licenseBackUrl)) {
    return <Navigate to="/rider/onboarding" replace />;
  }
  return <RiderSignup />;
};

export default RiderEntry;