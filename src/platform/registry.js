// ── Tool registry (the plugin contract) ─────────────────────────────────
// Every tool in the marketplace — first-party or third-party — is described by
// a Manifest and registered here. This single contract is what lets "plug &
// play" tools and "developer" tools sit side by side and be served the same way.
//
// Manifest shape:
// {
//   id:          unique slug, e.g. "fund-totals"
//   name:        display name
//   tagline:     one line for cards
//   description: paragraph for the detail page
//   category:    "reports" | "apps" | "integrations"
//   tier:        "easy" | "dev"
//   priceMonthly: number in USD (0 = free)
//   scopes:      PCO OAuth scopes the tool needs, e.g. ["giving"]
//   author:      { name, url }
//   accent:      hex color for the tool's icon tile
//   Icon:        lucide-react icon component
//   Component:   React component rendered when the tool runs (gets { client })
//   source:      optional { type: "github", repo } for dev-tier tools
// }

const _tools = [];

export function registerTool(manifest) {
  if (_tools.find((t) => t.id === manifest.id)) return;
  _tools.push(manifest);
}

export function getTools() {
  return _tools.slice();
}

export function getTool(id) {
  return _tools.find((t) => t.id === id) || null;
}
