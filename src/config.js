// ── Brand / global config ──────────────────────────────────────────────
// Change BRAND in one place to rebrand the whole site.
export const BRAND = {
  name: "PCOnward",
  tagline: "The marketplace for Planning Center tools",
  blurb:
    "Reports, apps, and integrations that make Planning Center do more. Install a tool in one click, or build your own and sell it here.",
};

// Tool categories shown in the catalog filters.
export const CATEGORIES = [
  { id: "reports", label: "Reports" },
  { id: "apps", label: "Apps" },
  { id: "integrations", label: "Integrations" },
];

// The two experience tiers the marketplace supports.
export const TIERS = {
  easy: {
    id: "easy",
    label: "Plug & play",
    desc: "Install and use in one click. No setup, no code.",
  },
  dev: {
    id: "dev",
    label: "Developer",
    desc: "Deeper, configurable tools — connect a repo or write against the SDK, served here automatically.",
  },
};

// PCO scopes the platform can request during OAuth.
export const PCO_SCOPES = ["people", "giving", "check_ins", "services", "groups"];
