import React, { useEffect, useMemo, useState } from "react";
import { HeartHandshake, Download } from "lucide-react";
import { money, Loading, StatCard, Table } from "../platform/ui.jsx";

const DAY = 86400000;

function LapsedDonors({ client }) {
  const [state, setState] = useState({ loading: true });
  const [weeks, setWeeks] = useState(8); // "gone quiet" window

  useEffect(() => {
    let alive = true;
    (async () => {
      const [gifts, people] = await Promise.all([client.giving(), client.people()]);
      if (!alive) return;
      setState({ loading: false, gifts, people });
    })();
    return () => { alive = false; };
  }, [client]);

  const lapsed = useMemo(() => {
    if (state.loading) return [];
    const today = new Date("2026-07-01").getTime();
    const cutoff = new Date(today - weeks * 7 * DAY).toISOString().slice(0, 10);
    const nameOf = Object.fromEntries(state.people.map((p) => [p.id, p.name]));
    const byPerson = {};
    for (const g of state.gifts) {
      const p = (byPerson[g.personId] ||= { prior: 0, priorCount: 0, recentCount: 0, last: null });
      if (g.date >= cutoff) p.recentCount++;
      else { p.prior += g.amountCents; p.priorCount++; }
      if (!p.last || g.date > p.last.date) p.last = { date: g.date, amount: g.amountCents };
    }
    return Object.entries(byPerson)
      .filter(([, p]) => p.priorCount >= 3 && p.recentCount === 0)
      .map(([id, p]) => ({
        name: nameOf[id] || id,
        prior: p.prior,
        priorCount: p.priorCount,
        last: p.last,
        weeksSince: Math.round((today - new Date(p.last.date).getTime()) / (7 * DAY)),
      }))
      .sort((a, b) => b.prior - a.prior);
  }, [state, weeks]);

  if (state.loading) return <Loading />;
  const atRisk = lapsed.reduce((s, l) => s + l.prior, 0);

  return (
    <div>
      <div className="stat-row">
        <StatCard label="Donors gone quiet" value={lapsed.length} accent="#C0563B" />
        <StatCard label="Prior giving at risk" value={money(atRisk)} accent="#C0563B" />
        <StatCard label="Quiet window" value={`${weeks} weeks`} />
        <StatCard label="Avg prior gift" value={money(lapsed.length ? atRisk / lapsed.reduce((s, l) => s + l.priorCount, 0) : 0)} />
      </div>

      <div className="tool-controls" style={{ marginTop: 18 }}>
        {[6, 8, 12].map((w) => (
          <button key={w} className={`chip ${weeks === w ? "chip-on" : ""}`} onClick={() => setWeeks(w)}>
            No gift in {w} weeks
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }}
          onClick={() => alert("Exports the follow-up list as CSV — ships with the billing + serverless milestone.")}>
          <Download size={14} /> Export list
        </button>
      </div>

      <Table
        columns={[
          { key: "name", label: "Person" },
          { key: "last", label: "Last gift", render: (r) => r.last.date },
          { key: "amt", label: "Amount", align: "right", render: (r) => money(r.last.amount) },
          { key: "weeksSince", label: "Weeks quiet", align: "right", render: (r) => r.weeksSince },
          { key: "prior", label: "Prior 12-mo", align: "right", render: (r) => money(r.prior) },
        ]}
        rows={lapsed}
      />
      {lapsed.length === 0 && <div className="empty">No lapsed donors in this window — everyone's still giving.</div>}
    </div>
  );
}

export const manifest = {
  id: "lapsed-donors",
  name: "Lapsed Donor Alerts",
  tagline: "Spot regular givers who've quietly stopped — before they drift away.",
  description:
    "Stewardship's early-warning system. Finds people who gave consistently and then went silent, ranked by how much they used to give, with their last gift and how long it's been. Reach out with a personal thank-you before a quiet season becomes a lost family.",
  category: "apps",
  tier: "easy",
  priceMonthly: 15,
  scopes: ["giving", "people"],
  author: { name: "PCOnward", url: "#" },
  accent: "#C0563B",
  Icon: HeartHandshake,
  Component: LapsedDonors,
};
