export type InvitedSeller = {
  token: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  buyerName: string;
  productName: string;
  productDescription?: string;
  amount: number;
  orderId: string;
  createdAt: string;
  status: "invited" | "viewed" | "accepted" | "completed";
  bank?: { accountName: string; accountNumber: string; bankName: string };
  withdrawn?: boolean;
};

const KEY = "cheinly:invitedSellers";

const read = (): InvitedSeller[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const write = (list: InvitedSeller[]) => localStorage.setItem(KEY, JSON.stringify(list));

export const listInvites = () => read();
export const getInvite = (token: string) => read().find((i) => i.token === token);
export const upsertInvite = (inv: InvitedSeller) => {
  const list = read().filter((i) => i.token !== inv.token);
  list.unshift(inv);
  write(list);
};
export const updateInvite = (token: string, patch: Partial<InvitedSeller>) => {
  const list = read();
  const idx = list.findIndex((i) => i.token === token);
  if (idx === -1) return;
  list[idx] = { ...list[idx], ...patch };
  write(list);
};

export const makeToken = () =>
  Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8);

export const inviteUrl = (token: string) =>
  `${window.location.origin}/invite/seller/${token}`;

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;