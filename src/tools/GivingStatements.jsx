import React, { useEffect, useMemo, useState } from "react";
import { FileText, Download, Search } from "lucide-react";
import { money, Loading, Table } from "../platform/ui.jsx";
import { ORG } from "../pco/mockData.js";

function GivingStatements({ client }) {
  const [data, setData] = useState({ loading: true });
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [people, funds, gifts] = await Promise.all([
        client.people(), client.listFunds(), client.giving({ since: "2026-01-01" }),
      ]);
      if (!alive) return;
      setData({ loading: false, people, funds, gifts });
    })();
    return () => { alive = false; };
  }, [client]);

  const results = useMemo(() => {
    if (data.loading) return [];
    const q = query.trim().toLowerCase();
    return data.people
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, data]);

  if (data.loading) return <Loading />;

  const statement = selected && (() => {
    const gifts = data.gifts.filter((g) => g.personId === selected.id);
    const byFund = data.funds
      .map((f) => ({ fund: f, total: gifts.filter((g) => g.fundId === f.id).reduce((s, g) => s + g.amountCents, 0) }))
      .filter((r) => r.total > 0)
      .sort((a, b) => b.total - a.total);
    const total = byFund.reduce((s, r) => s + r.total, 0);
    return { gifts, byFund, total };
  })();

  return (
    <div className="split">
      <div className="split-side">
        <div className="tool-search">
          <Search size={15} />
          <input placeholder="Search a person…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="person-list">
          {results.map((p) => (
            <button
              key={p.id}
              className={`person ${selected?.id === p.id ? "person-on" : ""}`}
              onClick={() => setSelected(p)}
            >
              <span>{p.name}</span>
              <small>member since {p.joinedYear}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="split-main">
        {!selected ? (
          <div className="empty">Pick a person to generate their 2026 giving statement.</div>
        ) : (
          <div className="statement">
            <div className="statement-head">
              <div>
                <div className="statement-org">{ORG.name}</div>
                <div className="statement-title">2026 Giving Statement</div>
                <div className="statement-person">{selected.name} · {selected.email}</div>
              </div>
              <button className="btn btn-ghost" onClick={() => alert("PDF export ships with the Stripe + serverless milestone — this generates a mailable statement per household.")}>
                <Download size={15} /> Export PDF
              </button>
            </div>

            <Table
              columns={[
                { key: "fund", label: "Fund", render: (r) => r.fund.name },
                { key: "total", label: "Amount", align: "right", render: (r) => money(r.total) },
              ]}
              rows={statement.byFund}
            />
            <div className="statement-total">
              <span>Total tax-deductible contributions</span>
              <b>{money(statement.total)}</b>
            </div>
            <p className="statement-fine">
              No goods or services were provided in exchange for these contributions except intangible
              religious benefits. {statement.gifts.length} gifts recorded in 2026.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const manifest = {
  id: "giving-statements",
  name: "Giving Statements",
  tagline: "One-click year-end contribution statements, ready to mail.",
  description:
    "Generate IRS-friendly annual giving statements for every household from your Planning Center Giving data — with per-fund breakdowns and the required tax language. No more exporting to spreadsheets in January.",
  category: "apps",
  tier: "easy",
  priceMonthly: 12,
  scopes: ["giving", "people"],
  author: { name: "PCOnward", url: "#" },
  accent: "#4F7DF0",
  Icon: FileText,
  Component: GivingStatements,
};
