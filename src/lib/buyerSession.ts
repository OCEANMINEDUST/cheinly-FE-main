/**
 * Lightweight "remembered device" session for buyers.
 * No real auth — we store a fingerprint of the browser + last buyer profile so
 * returning visitors can land directly on /buyer/dashboard without going through
 * the product invite flow or signing in again.
 */

const KEY = "cheinly:buyerSession";

export type BuyerSession = {
  fingerprint: string;
  name: string;
  email: string;
  productId: string;
  lastSeen: number;
};

const buildFingerprint = (): string => {
  const parts = [
    navigator.userAgent,
    navigator.language,
    String(screen.width),
    String(screen.height),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ];
  // tiny non-crypto hash — good enough for "same browser" matching
  let h = 0;
  const s = parts.join("|");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `fp_${Math.abs(h).toString(36)}`;
};

export const getBuyerSession = (): BuyerSession | null => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as BuyerSession;
    if (s.fingerprint !== buildFingerprint()) return null;
    return s;
  } catch {
    return null;
  }
};

export const rememberBuyer = (
  partial: Omit<BuyerSession, "fingerprint" | "lastSeen">,
) => {
  const session: BuyerSession = {
    ...partial,
    fingerprint: buildFingerprint(),
    lastSeen: Date.now(),
  };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
};

export const forgetBuyer = () => localStorage.removeItem(KEY);

export const buyerDashboardUrl = (s: BuyerSession) => {
  const params = new URLSearchParams({
    productId: s.productId,
    entry: "secure-checkout",
    mode: "guest",
    provider: "cheinly",
  });
  return `/buyer/dashboard?${params.toString()}`;
};

/**
 * Returns true if this device has a synced buyer account.
 * Used by routes that should auto-skip sign-in for remembered devices.
 */
export const hasBuyerSession = () => getBuyerSession() !== null;