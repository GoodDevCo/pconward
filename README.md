# PCOnward — the marketplace for Planning Center tools

A working MVP of a marketplace where churches install plug-and-play **reports, apps, and integrations** for Planning Center in one click — and where developers build and sell their own tools, served the same way.

> Not affiliated with Planning Center. "PCO" refers to Planning Center Online.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Everything runs on realistic **demo data**, so the whole marketplace — connecting, installing, and running tools — works with zero setup.

## The idea

Two audiences, one platform:

- **Plug & play (easy tier)** — a church admin connects Planning Center, clicks install, and immediately gets a working tool. No code.
- **Developer tier** — anyone can build a deeper/custom tool against a simple SDK, connect a GitHub repo, and have it hosted, billed, and listed here automatically. GitHub-meets-app-store.

## How it's built

Every tool — first-party or third-party — is the **same contract**: a `manifest` plus a React `Component` that receives a ready-authed PCO `client`. That single contract is what lets easy and dev tools sit side by side and be served identically.

```
src/
  config.js            brand + categories + tiers (rebrand in one place)
  pco/
    mockData.js        realistic Planning Center demo data
    client.js          data layer — demo now, real OAuth API later (same methods)
  platform/
    registry.js        the plugin contract: registerTool / getTools
    ui.jsx             shared UI kit (stats, charts, tables)
  tools/               each tool = manifest + component
    FundTotals.jsx        report · giving by fund (free)
    GivingStatements.jsx  app · year-end statements ($12/mo)
    AttendanceDashboard.jsx report · attendance trends ($9/mo)
    MailchimpSync.jsx     integration · dev tier, open source ($19/mo)
  App.jsx              marketplace, tool detail, run, developer page, connect + buy flows
```

Adding a tool = drop a manifest into `tools/index.js`. Nothing else changes.

## What works today (MVP)

- Marketplace catalog with category + tier filters
- Tool detail pages with pricing, scopes, and publisher info
- "Connect Planning Center" flow (demo OAuth) and per-tool install / subscribe flow
- Four **fully functional** tools running on live-shaped demo data
- Developer page explaining the build-and-sell contract

## Roadmap (next milestones)

1. **Real PCO OAuth** — swap `client.js` demo mode for the live Planning Center API using the church's access token. Tools don't change.
2. **Backend + persistence** — serverless functions + a database (Supabase) for orgs, installs, and tokens (kept server-side).
3. **Billing** — Stripe subscriptions per church, per tool; revenue split for third-party publishers.
4. **Developer submission** — connect a GitHub repo, sandboxed build + review, auto-listing.
5. **Deploy** — ship to Vercel (same flow as Rain Reality) on a custom domain.
