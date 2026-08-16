export const SITE_URL = "https://cheinly.lovable.app";
export const SITE_NAME = "Cheinly";
export const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f190ee90-6ec8-4e37-a012-4fbc5bb19141/id-preview-4da2a841--ee792745-ce8f-4a6f-8a5a-1c5eea57ebd2.lovable.app-1777127362523.png";

export type SeoTemplate = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "product" | "profile";
  robots?: string;
};

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: "Escrow-protected marketplace transactions with verified delivery across Nigeria.",
  logo: `${SITE_URL}/favicon.ico`,
  sameAs: ["https://twitter.com/Cheinly"],
};

export const defaultSeo: SeoTemplate = {
  title: "Cheinly — Escrow-Protected Buying & Selling",
  description: "Buy and sell with escrow-protected payments, verified delivery, and logistics partners across Nigeria.",
  path: "/",
};

const buyerTemplates: Record<string, SeoTemplate> = {
  "/buy": {
    title: "Start Protected Checkout — Cheinly Buyer",
    description: "Open a secure Cheinly checkout, review the product, and pay into escrow until delivery is verified.",
    path: "/buy",
  },
  "/buyer/browse": {
    title: "Browse Verified Products — Cheinly Buyer",
    description: "Discover products from trusted sellers and shop with Cheinly's escrow-protected buyer journey.",
    path: "/buyer/browse",
  },
  "/buyer/product": {
    title: "Product Details — Cheinly Protected Purchase",
    description: "Review product details, seller verification, delivery perks, and escrow protection before checkout on Cheinly.",
    path: "/buyer/product",
    ogType: "product",
  },
  "/buyer/shipping": {
    title: "Shipping Details — Cheinly Buyer",
    description: "Add delivery details for your protected Cheinly purchase and prepare verified shipment updates.",
    path: "/buyer/shipping",
    robots: "noindex,follow",
  },
  "/buyer/payment": {
    title: "Secure Payment — Cheinly Buyer",
    description: "Pay safely through Cheinly escrow so funds are released only after delivery and transaction verification.",
    path: "/buyer/payment",
    robots: "noindex,follow",
  },
  "/buyer/dashboard": {
    title: "Buyer Dashboard — Cheinly",
    description: "Track protected orders, disputes, delivery confirmations, and account activity from your Cheinly buyer dashboard.",
    path: "/buyer/dashboard",
    robots: "noindex,follow",
  },
  "/buyer/orders": {
    title: "Buyer Orders — Cheinly",
    description: "View Cheinly buyer orders, shipment progress, payment protection, receipts, and delivery confirmations.",
    path: "/buyer/orders",
    robots: "noindex,follow",
  },
  "/buyer/transactions": {
    title: "Buyer Transactions — Cheinly",
    description: "Review protected payment history, refunds, and escrow transaction status for your Cheinly account.",
    path: "/buyer/transactions",
    robots: "noindex,follow",
  },
  "/buyer/help": {
    title: "Buyer Help — Cheinly",
    description: "Get buyer support for protected checkout, delivery confirmation, refunds, returns, and disputes on Cheinly.",
    path: "/buyer/help",
  },
};

const sellerTemplates: Record<string, SeoTemplate> = {
  "/seller": {
    title: "Seller Dashboard — Cheinly",
    description: "Manage protected sales, orders, fulfillment, disputes, and payouts from your Cheinly seller workspace.",
    path: "/seller",
    robots: "noindex,follow",
  },
  "/seller/dashboard": {
    title: "Seller Dashboard — Cheinly",
    description: "Monitor seller performance, protected orders, delivery status, and balance activity on Cheinly.",
    path: "/seller/dashboard",
    robots: "noindex,follow",
  },
  "/seller/orders": {
    title: "Seller Orders — Cheinly",
    description: "Process Cheinly orders, confirm fulfillment steps, and keep buyers updated through protected delivery flows.",
    path: "/seller/orders",
    robots: "noindex,follow",
  },
  "/seller/dispatch": {
    title: "Dispatch Orders — Cheinly Seller",
    description: "Prepare dispatch, coordinate logistics, and move protected Cheinly seller orders toward verified delivery.",
    path: "/seller/dispatch",
    robots: "noindex,follow",
  },
  "/seller/tracking": {
    title: "Seller Tracking — Cheinly",
    description: "Track shipments and fulfillment milestones for protected Cheinly seller orders.",
    path: "/seller/tracking",
    robots: "noindex,follow",
  },
  "/seller/transactions": {
    title: "Seller Transactions — Cheinly",
    description: "Review seller payouts, protected balances, refunds, and escrow transaction activity on Cheinly.",
    path: "/seller/transactions",
    robots: "noindex,follow",
  },
  "/seller/disputes": {
    title: "Seller Disputes — Cheinly",
    description: "Resolve buyer issues, provide evidence, and manage seller dispute workflows for Cheinly protected orders.",
    path: "/seller/disputes",
    robots: "noindex,follow",
  },
  "/seller/fulfillment": {
    title: "Seller Fulfillment Settings — Cheinly",
    description: "Configure fulfillment preferences, logistics partners, and delivery options for your Cheinly seller account.",
    path: "/seller/fulfillment",
    robots: "noindex,follow",
  },
};

export const seoTemplates: Record<string, SeoTemplate> = {
  "/": defaultSeo,
  "/auth/login": {
    title: "Log In — Cheinly",
    description: "Log in to Cheinly to manage protected purchases, seller orders, and secure marketplace transactions.",
    path: "/auth/login",
  },
  "/auth/signup": {
    title: "Create Your Cheinly Account",
    description: "Sign up for Cheinly to buy and sell with escrow-protected payments and verified delivery workflows.",
    path: "/auth/signup",
  },
  "/help": {
    title: "Help Centre — Cheinly",
    description: "Find answers about Cheinly escrow protection, buyer support, seller fulfillment, disputes, and account access.",
    path: "/help",
  },
  "/help/contact": {
    title: "Contact Cheinly Support",
    description: "Contact Cheinly for help with protected purchases, seller orders, refunds, delivery issues, and disputes.",
    path: "/help/contact",
  },
  "/policies": {
    title: "Policies — Cheinly",
    description: "Review Cheinly marketplace policies for protected payments, delivery verification, refunds, and account safety.",
    path: "/policies",
  },
  ...buyerTemplates,
  ...sellerTemplates,
};

export const getSeoTemplate = (pathname: string): SeoTemplate => {
  if (seoTemplates[pathname]) return seoTemplates[pathname];

  if (pathname.startsWith("/buyer/seller/")) {
    return {
      title: "Seller Catalog — Cheinly Buyer",
      description: "Browse a seller catalog on Cheinly and purchase eligible products with protected checkout.",
      path: pathname,
      ogType: "profile",
    };
  }

  if (pathname.startsWith("/buyer/")) {
    const label = pathname.split("/").filter(Boolean).slice(1).join(" ").replace(/-/g, " ") || "buyer";
    return {
      title: `${toTitleCase(label)} — Cheinly Buyer`,
      description: `Use Cheinly buyer tools for ${label}, protected payments, delivery updates, and support.`,
      path: pathname,
      robots: "noindex,follow",
    };
  }

  if (pathname.startsWith("/seller/")) {
    const label = pathname.split("/").filter(Boolean).slice(1).join(" ").replace(/-/g, " ") || "seller";
    return {
      title: `${toTitleCase(label)} — Cheinly Seller`,
      description: `Use Cheinly seller tools for ${label}, protected orders, fulfillment, payouts, and support.`,
      path: pathname,
      robots: "noindex,follow",
    };
  }

  return { ...defaultSeo, path: pathname };
};

export const buildCanonicalUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

const toTitleCase = (value: string) =>
  value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
