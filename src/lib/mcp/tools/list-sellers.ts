import { defineTool } from "@lovable.dev/mcp-js";
import { sellers } from "../data";

export default defineTool({
  name: "list_sellers",
  title: "List sellers",
  description: "List every seller and supplier storefront available on Cheinly, including their bio-link username and business type.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(sellers, null, 2) }],
    structuredContent: { sellers },
  }),
});