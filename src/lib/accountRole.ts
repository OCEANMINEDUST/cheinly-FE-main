export type AccountRole = "seller" | "supplier";
const KEY = "cheinly-account-role";

export const getAccountRole = (): AccountRole => {
  if (typeof window === "undefined") return "seller";
  const stored = window.localStorage.getItem(KEY);
  return stored === "supplier" ? "supplier" : "seller";
};

export const setAccountRole = (role: AccountRole) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, role);
};

export const canAccessPath = (role: AccountRole, path: string) => {
  if (path.startsWith("/seller")) return role === "seller";
  if (path.startsWith("/supplier")) return role === "supplier";
  return true;
};
