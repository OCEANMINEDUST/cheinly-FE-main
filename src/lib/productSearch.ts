export type ProductMatch = {
  id: string;
  name: string;
  niche: "electronics" | "fashion" | "home";
  supplier: string;
  contact: string;
  price: number;
  trend: number;
  demandScore: number;
};

export type ProductQueryRecord = {
  id: string;
  term: string;
  imageDataUrl?: string;
  imageName?: string;
  createdAt: string;
  resultIds: string[];
};

export type MarketAnalysis = {
  niche: ProductMatch["niche"];
  avgPrice: number;
  avgTrend: number;
  avgDemand: number;
  recommendation: string;
  generatedAt: string;
};

export type AnalysisThresholds = {
  minProducts: number;
  minSuppliers: number;
  minTimeRangeDays: number;
};

export type AnalysisProgress = {
  ingestedProducts: number;
  ingestedSuppliers: number;
  ingestedDays: number;
  totalProducts: number;
  totalSuppliers: number;
  totalDays: number;
  ready: boolean;
};

const QUERY_KEY = "cheinly-product-query-history";
const ANALYSIS_KEY = "cheinly-market-analysis-cache";
const THRESHOLDS: AnalysisThresholds = { minProducts: 2, minSuppliers: 2, minTimeRangeDays: 7 };

const catalog: ProductMatch[] = [
  { id: "p1", name: "iPhone 14 Pro 256GB", niche: "electronics", supplier: "Tech Hub Lagos", contact: "+234-801-111-2233", price: 980000, trend: 4.2, demandScore: 90 },
  { id: "p2", name: "Samsung A55", niche: "electronics", supplier: "Mobile Arena", contact: "+234-703-222-1212", price: 420000, trend: 2.4, demandScore: 81 },
  { id: "p3", name: "Nike Air Force 1", niche: "fashion", supplier: "Sneaker Point", contact: "+234-809-333-7776", price: 95000, trend: 6.1, demandScore: 85 },
  { id: "p4", name: "Ankara Gown", niche: "fashion", supplier: "AsoMart", contact: "+234-802-555-0077", price: 38000, trend: 3.3, demandScore: 70 },
];

export const searchProducts = async (term: string) => {
  const lowered = term.trim().toLowerCase();
  return catalog.filter((p) => p.name.toLowerCase().includes(lowered));
};

export const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const readHistory = (): ProductQueryRecord[] => {
  try { return JSON.parse(localStorage.getItem(QUERY_KEY) || "[]"); } catch { return []; }
};

export const getProductQueryHistory = () => readHistory();

export const saveProductQuery = (record: ProductQueryRecord) => {
  const next = [record, ...readHistory()].slice(0, 20);
  localStorage.setItem(QUERY_KEY, JSON.stringify(next));
};

const readAnalysisCache = (): Record<string, MarketAnalysis> => {
  try { return JSON.parse(localStorage.getItem(ANALYSIS_KEY) || "{}"); } catch { return {}; }
};

export const getSavedAnalysis = (niche: ProductMatch["niche"]) => readAnalysisCache()[niche] || null;

export const saveAnalysis = (analysis: MarketAnalysis) => {
  const cache = readAnalysisCache();
  cache[analysis.niche] = analysis;
  localStorage.setItem(ANALYSIS_KEY, JSON.stringify(cache));
};

export const getThresholds = () => THRESHOLDS;

export const getCriteriaStatus = (results: ProductMatch[]) => {
  const suppliers = new Set(results.map((r) => r.supplier)).size;
  const daysRange = results.length ? 7 : 0;
  return {
    products: results.length,
    suppliers,
    daysRange,
    missing: {
      products: Math.max(0, THRESHOLDS.minProducts - results.length),
      suppliers: Math.max(0, THRESHOLDS.minSuppliers - suppliers),
      daysRange: Math.max(0, THRESHOLDS.minTimeRangeDays - daysRange),
    },
  };
};

export const marketAnalysisFor = (results: ProductMatch[], niche: ProductMatch["niche"]): MarketAnalysis | null => {
  if (results.length < 2) return null;
  const avgPrice = Math.round(results.reduce((s, r) => s + r.price, 0) / results.length);
  const avgTrend = Number((results.reduce((s, r) => s + r.trend, 0) / results.length).toFixed(1));
  const avgDemand = Math.round(results.reduce((s, r) => s + r.demandScore, 0) / results.length);
  const rec = avgDemand > 80 ? "Increase stock and optimize fast-delivery listings." : "Focus on competitive pricing and product bundling.";
  return { niche, avgPrice, avgTrend, avgDemand, recommendation: rec, generatedAt: new Date().toISOString() };
};

export const computeProgress = (results: ProductMatch[]): AnalysisProgress => {
  const crit = getCriteriaStatus(results);
  return {
    ingestedProducts: Math.min(crit.products, THRESHOLDS.minProducts),
    ingestedSuppliers: Math.min(crit.suppliers, THRESHOLDS.minSuppliers),
    ingestedDays: Math.min(crit.daysRange, THRESHOLDS.minTimeRangeDays),
    totalProducts: THRESHOLDS.minProducts,
    totalSuppliers: THRESHOLDS.minSuppliers,
    totalDays: THRESHOLDS.minTimeRangeDays,
    ready: crit.missing.products === 0 && crit.missing.suppliers === 0 && crit.missing.daysRange === 0,
  };
};
