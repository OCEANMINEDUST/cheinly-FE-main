import { defineMcp } from "@lovable.dev/mcp-js";
import listSellersTool from "./tools/list-sellers";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";

export default defineMcp({
  name: "cheinly-mcp",
  title: "Cheinly MCP",
  version: "0.1.0",
  instructions:
    "Read-only tools for the Cheinly marketplace. Use `list_sellers` to see storefronts, `list_products` to browse or search the catalog (optionally filtered by seller), and `get_product` for details on a specific product ID.",
  tools: [listSellersTool, listProductsTool, getProductTool],
});