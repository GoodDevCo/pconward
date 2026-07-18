import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { money, Loading, StatCard, LineChart, BarList, Table } from "../platform/ui.jsx";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const monthLabel = (ym) => {
  const [y, m] = ym.split("-");
  return `${MONTHS[+m - 1]} ${y.slice(2)}`;
};

function GivingTrends({ client }) {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let alive = true;
    (async () => {
      const [gifts, people] = await Promise.all([client.giving(), client.people()]);
      if (!alive) return;
      const byMonth = {};
      const byPerson = {};
      for (const g of gifts) {
        const ym = g.date.slice(0, 7);
        byMonth[ym] = (byMonth[ym] || 0) + g.amountCents;
        byPerson[g.personId] = (byPerson[g.personId] || 0) + g.amountCents;
      }
      const months = Object.keys(byMonth).sort().map((ym) => ({ ym, total: byMonth[ym] }));
      const total = months.reduce((s, m) => s + m.total, 0);
      const nameOf = Object.fromEntries(people.map((p) => [p.id, p.name]));
      const topGivers = Object.entries(byPerson)
        .map(([id, amt]) => ({ name: nameOf[id] || id, total: amt }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 8);
      const best = months.reduce((a, b) => (b.total > a.total ? b : a), months[0]);
      setState({ loading: false, months, total, topGivers, best });
    })();
    return () => { alive = false; };
  }, [client]);

  if (state.loading) return <Loading />;
  const avg = Math.round(state.total / state.months.length);

  return (
    <div>
      <div className="stat-row">
        <StatCard label="Total (12 mo)" value={money(state.total)} accent="#3EA46B" />
        <StatCard label="Monthly average" value={money(avg)} />
        <StatCard label="Best month" value={monthLabel(state.best.ym)} sub={money(state.best.total)} />
        <StatCard label="Months tracked" value={state.months.length} />
      </div>

      <h4 className="tool-h">Monthly giving trend</h4>
      <div className="chart-card">
        <LineChart points={state.months.map((m) => ({ y: m.total }))} accent="#3EA46B" />
        <div className="chart-axis">
          <span>{monthLabel(state.months[0].ym)}</span>
          <span>{monthLabel(state.months[state.months.length - 1].ym)}</span>
        </div>
      </div>

      <h4 className="tool-h">By month</h4>
      <BarList
        accent="#3EA46B"
        rows={state.months.map((m) => ({ label: monthLabel(m.ym), value: m.total, display: money(m.total) }))}
      />

      <h4 className="tool-h">Top givers</h4>
      <Table
        columns={[
          { key: "name", label: "Person" },
          { key: "total", label: "12-mo giving", align: "right", render: (r) => money(r.total) },
        ]}
        rows={state.topGivers}
      />
    </div>
  );
}

export const manifest = {
  id: "giving-trends",
  name: "Giving Trends",
  tagline: "Monthly giving trend, best months, and your top givers at a glance.",
  description:
    "See where giving is heading. A 12-month trend line, month-by-month breakdown, your strongest month, and a ranked list of top givers — pulled straight from Planning Center Giving. Perfect for the finance team's monthly review.",
  category: "reports",
  tier: "easy",
  priceMonthly: 9,
  scopes: ["giving", "people"],
  author: { name: "PCOnward", url: "#" },
  accent: "#3EA46B",
  Icon: TrendingUp,
  Component: GivingTrends,
};
