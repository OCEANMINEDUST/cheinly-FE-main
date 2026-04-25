import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getDocuments, getRider, isOnboardingComplete, isRiderActive } from "@/lib/riderMock";

/**
 * Gate the approved-rider area.
 * - new (no docs uploaded) → /rider (signup)
 * - onboarding incomplete → /rider/onboarding
 * - pending → /rider/approval
 * - approved/online/offline → render children
 */
export const RiderRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  // Force re-evaluation when route changes (storage updates outside React).
  const [, setTick] = useState(0);
  useEffect(() => setTick((t) => t + 1), [location.pathname]);

  const rider = getRider();
  const docs = getDocuments();

  if (rider.status === "new" && !isOnboardingComplete(docs)) {
    return <Navigate to="/rider" replace />;
  }
  if (!isOnboardingComplete(docs)) {
    return <Navigate to="/rider/onboarding" replace />;
  }
  if (!isRiderActive(rider)) {
    return <Navigate to="/rider/approval" replace />;
  }
  return <>{children}</>;
};