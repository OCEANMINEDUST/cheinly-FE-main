import type { FlowKey, MarketplaceRole } from "./flowStructure";

type FlowStructurePanelProps = {
  role: MarketplaceRole;
  active: FlowKey;
  compact?: boolean;
};

// Descriptive flow narration removed by request. Stub kept so existing
// imports across buyer/seller/supplier pages continue to compile.
export function FlowStructurePanel(_props: FlowStructurePanelProps) {
  return null;
}