import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { products, sellers } from "../data";

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List active Cheinly products. Optionally filter by seller username, in-stock only, or a text query on name/description.",
  inputSchema: {
    sellerUsername: z.string().trim().min(1).optional().describe("Seller/supplier username (e.g. 'adunni' or 'globalsneakers')."),
    inStockOnly: z.boolean().optional().describe("If true, only return products currently in stock."),
    query: z.string().trim().min(1).optional().describe("Case-insensitive substring to match against name and description."),
    limit: z.number().int().min(1).max(50).optional().describe("Maximum number of products to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ sellerUsername, inStockOnly, query, limit }) => {
    if (sellerUsername && !sellers.some((s) => s.username.toLowerCase() === sellerUsername.toLowerCase())) {
      return { content: [{ type: "text", text: `Unknown seller username: ${sellerUsername}` }], isError: true };
    }
    const q = query?.toLowerCase();
    const results = products
      .filter((p) => (sellerUsername ? p.sellerUsername.toLowerCase() === sellerUsername.toLowerCase() : true))
      .filter((p) => (inStockOnly ? p.inStock : true))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) : true))
      .slice(0, limit ?? 20);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { count: results.length, products: results },
    };
  },
});