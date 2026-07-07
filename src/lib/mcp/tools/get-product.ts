import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { products } from "../data";

export default defineTool({
  name: "get_product",
  title: "Get product",
  description: "Fetch a single Cheinly product by its product ID (e.g. 'PRD_83921').",
  inputSchema: {
    productId: z.string().trim().min(1).describe("Product ID such as 'PRD_83921'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ productId }) => {
    const product = products.find((p) => p.id.toLowerCase() === productId.toLowerCase());
    if (!product) {
      return { content: [{ type: "text", text: `Product not found: ${productId}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});