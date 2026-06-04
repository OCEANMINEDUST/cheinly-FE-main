import sneakerImg from "@/assets/sneaker.jpg";

export type StoreProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  sellerUsername: string;
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
  },
  {
    id: "PRD_77104",
    name: "Velvet Wrap Dress — Emerald",
    price: 42500,
    image: sneakerImg,
    description: "Hand-finished velvet wrap dress. Sizes XS–XL.",
    sellerUsername: "adunni",
  },
  {
    id: "PRD_77105",
    name: "Linen Agbada Set — Cream",
    price: 86000,
    image: sneakerImg,
    description: "Tailored 3-piece linen agbada set.",
    sellerUsername: "adunni",
  },
];

export const getSellerByUsername = (u: string) =>
  sellers.find((s) => s.username.toLowerCase() === u.toLowerCase());

export const getProductsBySeller = (username: string) =>
  products.filter((p) => p.sellerUsername.toLowerCase() === username.toLowerCase());

export const getProductById = (id: string) =>
  products.find((p) => p.id.toLowerCase() === id.toLowerCase());

export const allProducts = () => products;

export const bioLink = (username: string) =>
  `${typeof window !== "undefined" ? window.location.origin : "https://cheinly.com"}/u/${username}`;

export const productLink = (productId: string) =>
  `${typeof window !== "undefined" ? window.location.origin : "https://cheinly.com"}/p/${productId}`;

export const formatNaira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;