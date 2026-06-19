import sneakerImg from "@/assets/sneaker.jpg";

export type StoreProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  sellerUsername: string;
  active: boolean;
  inStock: boolean;
  updatedAt?: string;
  salesCount?: number;
};

export type StoreSeller = {
  username: string;
  name: string;
  bio: string;
  phone: string; // E.164 digits only, no +
  telegram?: string; // telegram username (no @)
  type: "seller" | "supplier";
};

const sellers: StoreSeller[] = [
  {
    username: "adunni",
    name: "Cheinly Atelier — Adunni Okoye",
    bio: "Handcrafted Nigerian fashion. Ships nationwide via Cheinly Escrow.",
    phone: "2348012345678",
    telegram: "CheinlyBot",
    type: "seller",
  },
  {
    username: "globalsneakers",
    name: "Global Sneakers Ltd.",
    bio: "Authentic kicks, fast delivery, escrow-protected.",
    phone: "2348023456789",
    telegram: "CheinlyBot",
    type: "supplier",
  },
];

const products: StoreProduct[] = [
  {
    id: "PRD_83921",
    name: "Premium Men's Sneakers — Phantom Black",
    price: 45000,
    image: sneakerImg,
    description: "Cushioned sole, breathable mesh, size 40–45. Escrow protected.",
    sellerUsername: "globalsneakers",
    active: true,
    inStock: true,
    updatedAt: "2026-05-28",
    salesCount: 148,
  },
  {
    id: "PRD_83922",
    name: "AirFlex Trainers — Cloud White",
    price: 52000,
    image: sneakerImg,
    description: "Lightweight streetwear trainers with reinforced heel support.",
    sellerUsername: "globalsneakers",
    active: true,
    inStock: true,
    updatedAt: "2026-06-02",
    salesCount: 212,
  },
  {
    id: "PRD_83923",
    name: "Classic Court Sneakers — Forest Green",
    price: 39000,
    image: sneakerImg,
    description: "Low-profile court sneakers with a premium suede finish.",
    sellerUsername: "globalsneakers",
    active: true,
    inStock: true,
    updatedAt: "2026-06-01",
    salesCount: 126,
  },
  {
    id: "PRD_83924",
    name: "Runner Pro Knit — Midnight Navy",
    price: 61000,
    image: sneakerImg,
    description: "Breathable knit runners designed for daily wear and commuting.",
    sellerUsername: "globalsneakers",
    active: true,
    inStock: true,
    updatedAt: "2026-05-25",
    salesCount: 189,
  },
  {
    id: "PRD_83925",
    name: "Retro High Tops — Sandstone",
    price: 57500,
    image: sneakerImg,
    description: "Padded high tops with durable canvas panels and gum sole.",
    sellerUsername: "globalsneakers",
    active: true,
    inStock: false,
    updatedAt: "2026-06-03",
    salesCount: 95,
  },
  {
    id: "PRD_83926",
    name: "Slip-On Loafers — Onyx",
    price: 48000,
    image: sneakerImg,
    description: "Smart casual slip-ons with cushioned insoles and grip outsole.",
    sellerUsername: "globalsneakers",
    active: true,
    inStock: true,
    updatedAt: "2026-05-20",
    salesCount: 77,
  },
  {
    id: "PRD_83927",
    name: "TrailGrip Sneakers — Clay Orange",
    price: 68000,
    image: sneakerImg,
    description: "All-terrain sneakers with textured outsole and waterproof trim.",
    sellerUsername: "globalsneakers",
    active: true,
    inStock: true,
    updatedAt: "2026-05-18",
    salesCount: 64,
  },
  {
    id: "PRD_77104",
    name: "Velvet Wrap Dress — Emerald",
    price: 42500,
    image: sneakerImg,
    description: "Hand-finished velvet wrap dress. Sizes XS–XL.",
    sellerUsername: "adunni",
    active: true,
    inStock: true,
    updatedAt: "2026-05-30",
    salesCount: 84,
  },
  {
    id: "PRD_77105",
    name: "Linen Agbada Set — Cream",
    price: 86000,
    image: sneakerImg,
    description: "Tailored 3-piece linen agbada set.",
    sellerUsername: "adunni",
    active: true,
    inStock: true,
    updatedAt: "2026-06-02",
    salesCount: 117,
  },
  {
    id: "PRD_77106",
    name: "Silk Bubu Dress — Champagne",
    price: 53500,
    image: sneakerImg,
    description: "Flowing silk bubu with embroidered neckline and side pockets.",
    sellerUsername: "adunni",
    active: true,
    inStock: true,
    updatedAt: "2026-05-27",
    salesCount: 76,
  },
  {
    id: "PRD_77107",
    name: "Ankara Co-ord Set — Sunrise",
    price: 38000,
    image: sneakerImg,
    description: "Two-piece Ankara set with relaxed trousers and crop jacket.",
    sellerUsername: "adunni",
    active: true,
    inStock: true,
    updatedAt: "2026-05-22",
    salesCount: 92,
  },
  {
    id: "PRD_77108",
    name: "Beaded Clutch — Gold Noir",
    price: 24500,
    image: sneakerImg,
    description: "Evening clutch with hand-beaded finish and chain strap.",
    sellerUsername: "adunni",
    active: true,
    inStock: false,
    updatedAt: "2026-06-01",
    salesCount: 58,
  },
  {
    id: "PRD_77109",
    name: "Adire Kimono — Indigo Wave",
    price: 47000,
    image: sneakerImg,
    description: "Hand-dyed adire kimono layered for casual and occasion wear.",
    sellerUsername: "adunni",
    active: true,
    inStock: true,
    updatedAt: "2026-05-18",
    salesCount: 69,
  },
];

export const getSellerByUsername = (u: string) =>
  sellers.find((s) => s.username.toLowerCase() === u.toLowerCase());

export const getProductsBySeller = (username: string) =>
  products.filter((p) => p.active && p.sellerUsername.toLowerCase() === username.toLowerCase());

export const getProductById = (id: string) =>
  products.find((p) => p.active && p.id.toLowerCase() === id.toLowerCase());

export const allProducts = () => products.filter((p) => p.active);

export const rankSellerProducts = (sellerProducts: StoreProduct[]) => {
  const hasRankingData = sellerProducts.some((p) => p.updatedAt || typeof p.salesCount === "number");

  if (!hasRankingData) {
    return [...sellerProducts].sort(() => Math.random() - 0.5);
  }

  return [...sellerProducts].sort((a, b) => {
    if (a.inStock !== b.inStock) {
      return Number(b.inStock) - Number(a.inStock);
    }

    const updatedDiff = new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
    if (updatedDiff !== 0) {
      return updatedDiff;
    }

    return (b.salesCount ?? 0) - (a.salesCount ?? 0);
  });
};

export const getMoreFromSellerProducts = (username: string, excludeProductId?: string, limit = 6) =>
  rankSellerProducts(
    getProductsBySeller(username).filter((p) => p.id.toLowerCase() !== excludeProductId?.toLowerCase()),
  ).slice(0, limit);

export const bioLink = (username: string) =>
  `${typeof window !== "undefined" ? window.location.origin : "https://cheinly.com"}/u/${username}`;

export const productLink = (productId: string) =>
  `${typeof window !== "undefined" ? window.location.origin : "https://cheinly.com"}/p/${productId}`;

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;