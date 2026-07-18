import React, { useEffect, useState } from "react";
import { PieChart } from "lucide-react";
import { money, Loading, StatCard, BarList, Table } from "../platform/ui.jsx";

const RANGES = [
  { id: "30", label: "Last 30 days", days: 30 },
  { id: "90", label: "Last 90 days", days: 90 },
  { id: "365", label: "Last 12 months", days: 365 },
];

function FundTotals({ client }) {
  const [range, setRange] = useState("365");
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let alive = true;
    setState({ loading: true });
    (async () => {
      const days = RANGES.find((r) => r.id === range).days;
      const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
      const [funds, gifts] = await Promise.all([client.listFunds(), client.giving({ since })]);
      if (!alive) return;
      const byFund = funds.map((f) => {
        const rows = gifts.filter((g) => g.fundId === f.id);
        const total = rows.reduce((s, g) => s + g.amountCents, 0);
        return { fund: f, total, count: rows.length };
      }).sort((a, b) => b.total - a.total);
      const total = byFund.reduce((s, r) => s + r.total, 0);
      const gifts_count = gifts.length;
      setState({ loading: false, byFund, total, gifts_count });
    })();
    return () => { alive = false; };
  }, [range, client]);

  if (state.loading) return <Loading />;

  return (
    <div>
      <div className="tool-controls">
        {RANGES.map((r) => (
          <button
            key={r.id}
            className={`chip ${range === r.id ? "chip-on" : ""}`}
            onClick={() => setRange(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="stat-row">
        <StatCard label="Total received" value={money(state.total)} accent="#3EA46B" />
        <StatCard label="Gifts" value={state.gifts_count.toLocaleString()} />
        <StatCard label="Funds" value={state.byFund.length} />
        <StatCard
          label="Avg gift"
          value={money(state.gifts_count ? state.total / state.gifts_count : 0)}
        />
      </div>

      <h4 className="tool-h">Giving by fund</h4>
      <BarList
        rows={state.byFund.map((r) => ({
          label: r.fund.name,
          value: r.total,
          display: money(r.total),
          color: r.fund.color,
        }))}
      />

      <h4 className="tool-h">Detail</h4>
      <Table
        columns={[
          { key: "name", label: "Fund", render: (r) => r.fund.name },
          { key: "count", label: "Gifts", align: "right", render: (r) => r.count.toLocaleString() },
          { key: "total", label: "Total", align: "right", render: (r) => money(r.total) },
          {
            key: "pct", label: "Share", align: "right",
            render: (r) => `${((r.total / state.total) * 100).toFixed(1)}%`,
          },
        ]}
        rows={state.byFund}
      />
    </div>
  );
}

export const manifest = {
  id: "fund-totals",
  name: "Fund Totals",
  tagline: "See giving by fund over any window — the report PCO makes you dig for.",
  description:
    "A clean, always-current breakdown of giving by fund. Pick a date window and instantly see totals, gift counts, average gift, and each fund's share of the pie. Built for the treasurer who just wants the number.",
  category: "reports",
  tier: "easy",
  priceMonthly: 0,
  scopes: ["giving"],
  author: { name: "PCOnward", url: "#" },
  accent: "#3EA46B",
  Icon: PieChart,
  Component: FundTotals,
};
