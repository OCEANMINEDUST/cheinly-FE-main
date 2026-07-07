// Import-safe storefront snapshot for MCP tools.
// Do NOT import from files that reference `window`, asset URLs, or run I/O
// at module top level — this file is evaluated during the manifest extract
// and inside the Edge Function cold start where those aren't available.

export type McpStoreProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  sellerUsername: string;
  inStock: boolean;
};

export type McpStoreSeller = {
  username: string;
  name: string;
  bio: string;
  type: "seller" | "supplier";
};

export const sellers: McpStoreSeller[] = [
  { username: "adunni", name: "Cheinly Atelier — Adunni Okoye", bio: "Handcrafted Nigerian fashion. Ships nationwide via Cheinly Escrow.", type: "seller" },
  { username: "globalsneakers", name: "Global Sneakers Ltd.", bio: "Authentic kicks, fast delivery, escrow-protected.", type: "supplier" },
];

export const products: McpStoreProduct[] = [
  { id: "PRD_83921", name: "Premium Men's Sneakers — Phantom Black", price: 45000, description: "Cushioned sole, breathable mesh, size 40–45.", sellerUsername: "globalsneakers", inStock: true },
  { id: "PRD_83922", name: "AirFlex Trainers — Cloud White", price: 52000, description: "Lightweight streetwear trainers with reinforced heel support.", sellerUsername: "globalsneakers", inStock: true },
  { id: "PRD_83923", name: "Classic Court Sneakers — Forest Green", price: 39000, description: "Low-profile court sneakers with a premium suede finish.", sellerUsername: "globalsneakers", inStock: true },
  { id: "PRD_83924", name: "Runner Pro Knit — Midnight Navy", price: 61000, description: "Breathable knit runners for daily wear and commuting.", sellerUsername: "globalsneakers", inStock: true },
  { id: "PRD_83925", name: "Retro High Tops — Sandstone", price: 57500, description: "Padded high tops with durable canvas panels and gum sole.", sellerUsername: "globalsneakers", inStock: false },
  { id: "PRD_83926", name: "Slip-On Loafers — Onyx", price: 48000, description: "Smart casual slip-ons with cushioned insoles and grip outsole.", sellerUsername: "globalsneakers", inStock: true },
  { id: "PRD_83927", name: "TrailGrip Sneakers — Clay Orange", price: 68000, description: "All-terrain sneakers with textured outsole and waterproof trim.", sellerUsername: "globalsneakers", inStock: true },
  { id: "PRD_77104", name: "Velvet Wrap Dress — Emerald", price: 42500, description: "Hand-finished velvet wrap dress. Sizes XS–XL.", sellerUsername: "adunni", inStock: true },
  { id: "PRD_77105", name: "Linen Agbada Set — Cream", price: 86000, description: "Tailored 3-piece linen agbada set.", sellerUsername: "adunni", inStock: true },
  { id: "PRD_77106", name: "Silk Bubu Dress — Champagne", price: 53500, description: "Flowing silk bubu with embroidered neckline and side pockets.", sellerUsername: "adunni", inStock: true },
  { id: "PRD_77107", name: "Ankara Co-ord Set — Sunrise", price: 38000, description: "Two-piece Ankara set with relaxed trousers and crop jacket.", sellerUsername: "adunni", inStock: true },
  { id: "PRD_77108", name: "Beaded Clutch — Gold Noir", price: 24500, description: "Evening clutch with hand-beaded finish and chain strap.", sellerUsername: "adunni", inStock: false },
  { id: "PRD_77109", name: "Adire Kimono — Indigo Wave", price: 47000, description: "Hand-dyed adire kimono for casual and occasion wear.", sellerUsername: "adunni", inStock: true },
];