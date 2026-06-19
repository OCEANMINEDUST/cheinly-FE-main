import { useEffect, useMemo, useState } from "react";
import { Upload, Search, TrendingUp, History, Download, Loader2 } from "lucide-react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { computeProgress, getCriteriaStatus, getProductQueryHistory, getSavedAnalysis, getThresholds, marketAnalysisFor, readAsDataUrl, saveAnalysis, saveProductQuery, searchProducts, type MarketAnalysis, type ProductMatch } from "@/lib/productSearch";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function MarketLookup() {
  const [q, setQ] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [results, setResults] = useState<ProductMatch[]>([]);
  const [history, setHistory] = useState(getProductQueryHistory());
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);

  const niche = results[0]?.niche;
  const progress = useMemo(() => computeProgress(results), [results]);
  const criteria = useMemo(() => getCriteriaStatus(results), [results]);
  const thresholds = getThresholds();

  useEffect(() => {
    if (!niche) return;
    const cached = getSavedAnalysis(niche);
    if (cached) setAnalysis(cached);
  }, [niche]);

  useEffect(() => {
    if (!niche || !progress.ready) {
      setAnalysisLoading(false);
      return;
    }
    setAnalysisLoading(true);
    const job = window.setTimeout(() => {
      const next = marketAnalysisFor(results, niche);
      if (next) {
        saveAnalysis(next);
        setAnalysis(next);
      }
      setAnalysisLoading(false);
    }, 1200);
    const poll = window.setInterval(() => {
      const maybeReady = getSavedAnalysis(niche);
      if (maybeReady) {
        setAnalysis(maybeReady);
      }
    }, 1000);
    return () => {
      window.clearTimeout(job);
      window.clearInterval(poll);
    };
  }, [niche, progress.ready, results]);

  const runSearch = async () => {
    const matches = await searchProducts(q || imageName);
    setResults(matches);
    saveProductQuery({
      id: crypto.randomUUID(),
      term: q || imageName,
      imageDataUrl,
      imageName,
      createdAt: new Date().toISOString(),
      resultIds: matches.map((m) => m.id),
    });
    setHistory(getProductQueryHistory());
  };

  const exportCsv = () => {
    if (!analysis) return;
    const csv = `niche,avgPrice,avgTrend,avgDemand,recommendation,generatedAt\n${analysis.niche},${analysis.avgPrice},${analysis.avgTrend},${analysis.avgDemand},"${analysis.recommendation}",${analysis.generatedAt}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `market-analysis-${analysis.niche}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    if (!analysis) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><body><h2>Market Analysis (${analysis.niche})</h2><p>Avg Price: ${naira(analysis.avgPrice)}</p><p>Price Trend: ${analysis.avgTrend}%</p><p>Demand: ${analysis.avgDemand}/100</p><p>Recommendation: ${analysis.recommendation}</p><p>Generated: ${new Date(analysis.generatedAt).toLocaleString()}</p></body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <SupplierShell>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Product Finder</h1>
        <Card className="rounded-xl p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type product name (e.g., iPhone 14 Pro)" />
            <Button onClick={runSearch} className="bg-blue-600 hover:bg-blue-700"><Search className="mr-2 h-4 w-4" />Search Database</Button>
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-4 text-sm text-slate-600">
            <Upload className="h-4 w-4" /> Upload product picture to attach with query
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setImageName(f.name);
              setImageDataUrl(await readAsDataUrl(f));
            }} />
          </label>
        </Card>

        <Card className="rounded-xl border-blue-200 bg-blue-50 p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-semibold text-blue-700"><TrendingUp className="h-4 w-4" /> Market Analysis</div>
            {analysis && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportCsv}><Download className="mr-2 h-3.5 w-3.5" />Export CSV</Button>
                <Button variant="outline" size="sm" onClick={exportPdf}><Download className="mr-2 h-3.5 w-3.5" />Export PDF</Button>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <p>Progress: products {progress.ingestedProducts}/{progress.totalProducts}, suppliers {progress.ingestedSuppliers}/{progress.totalSuppliers}, time range {progress.ingestedDays}/{progress.totalDays} days.</p>
            <div className="h-2 w-full rounded-full bg-blue-100">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${Math.round(((progress.ingestedProducts + progress.ingestedSuppliers + progress.ingestedDays) / (progress.totalProducts + progress.totalSuppliers + progress.totalDays)) * 100)}%` }} />
            </div>
          </div>

          {analysisLoading ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-700"><Loader2 className="h-4 w-4 animate-spin" />Server is generating insights. Auto-refreshing view…</p>
          ) : !progress.ready ? (
            <div className="mt-3 text-sm text-slate-700">
              <p>Analysis cannot run yet. Missing criteria:</p>
              <ul className="ml-5 list-disc">
                <li>Products needed: {Math.max(0, thresholds.minProducts - criteria.products)}</li>
                <li>Suppliers needed: {Math.max(0, thresholds.minSuppliers - criteria.suppliers)}</li>
                <li>Time range days needed: {Math.max(0, thresholds.minTimeRangeDays - criteria.daysRange)}</li>
              </ul>
            </div>
          ) : analysis ? (
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              <p>Average price: <span className="font-semibold">{naira(analysis.avgPrice)}</span></p>
              <p>Price trend: <span className="font-semibold">{analysis.avgTrend}% monthly</span></p>
              <p>Demand score: <span className="font-semibold">{analysis.avgDemand}/100</span></p>
              <p>AI Recommendation: <span className="font-semibold">{analysis.recommendation}</span></p>
            </div>
          ) : null}
        </Card>

        <Card className="rounded-xl p-5">
          <h2 className="mb-3 font-semibold">Matching suppliers and exact prices</h2>
          <div className="space-y-3">
            {results.length === 0 ? <div className="text-sm text-slate-500">No results yet. Run a search.</div> : results.map((r) => (
              <div key={r.id} className="rounded-lg border p-3">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-slate-600">{r.supplier} • {r.contact}</div>
                <div className="text-sm font-semibold text-emerald-700">{naira(r.price)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-xl p-5">
          <div className="mb-3 flex items-center gap-2 font-semibold"><History className="h-4 w-4" /> Search history</div>
          <div className="space-y-2">
            {history.length === 0 ? <div className="text-sm text-slate-500">No previous searches yet.</div> : history.map((h) => (
              <div key={h.id} className="rounded-lg border p-3 text-sm">
                <div className="font-medium">{h.term || "Image-only query"}</div>
                <div className="text-xs text-slate-500">{new Date(h.createdAt).toLocaleString()} • {h.resultIds.length} matches</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SupplierShell>
  );
}
