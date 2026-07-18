import React, { useEffect, useState } from "react";
import { RefreshCw, Plug, CheckCircle2 } from "lucide-react";
import { Loading, Table } from "../platform/ui.jsx";

// A "developer tier" tool: it takes configuration and performs an action,
// rather than just displaying a report. Third-party devs ship tools shaped
// exactly like this against the same { client } contract.
function MailchimpSync({ client }) {
  const [people, setPeople] = useState(null);
  const [audience, setAudience] = useState("Weekly Newsletter");
  const [minGifts, setMinGifts] = useState(3);
  const [ran, setRan] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [ppl, gifts] = await Promise.all([client.people(), client.giving({ since: "2026-01-01" })]);
      if (!alive) return;
      const counts = {};
      gifts.forEach((g) => { counts[g.personId] = (counts[g.personId] || 0) + 1; });
      setPeople(ppl.map((p) => ({ ...p, gifts: counts[p.id] || 0 })));
    })();
    return () => { alive = false; };
  }, [client]);

  if (!people) return <Loading label="Reading Planning Center People…" />;
  const matched = people.filter((p) => p.gifts >= minGifts);

  return (
    <div>
      <div className="dev-config">
        <div className="field">
          <label>Mailchimp API key</label>
          <input type="password" placeholder="••••••••••••••••" defaultValue="demo-key" />
        </div>
        <div className="field">
          <label>Audience</label>
          <input value={audience} onChange={(e) => setAudience(e.target.value)} />
        </div>
        <div className="field">
          <label>Only sync donors with ≥ N gifts</label>
          <input type="number" min="0" value={minGifts} onChange={(e) => setMinGifts(+e.target.value || 0)} />
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => setRan(true)}>
        <RefreshCw size={15} /> Dry run
      </button>

      {ran && (
        <div className="dev-result">
          <div className="dev-result-head">
            <CheckCircle2 size={17} />
            <span><b>{matched.length}</b> contacts would sync to “{audience}”. (Dry run — nothing was sent.)</span>
          </div>
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "gifts", label: "2026 gifts", align: "right" },
            ]}
            rows={matched.slice(0, 8)}
          />
          {matched.length > 8 && <div className="dev-more">+{matched.length - 8} more…</div>}
        </div>
      )}
    </div>
  );
}

export const manifest = {
  id: "mailchimp-sync",
  name: "Giving → Mailchimp Sync",
  tagline: "Keep a Mailchimp audience of active donors in sync, automatically.",
  description:
    "A developer-tier integration: map Planning Center donors to a Mailchimp audience with your own rules (e.g. anyone with 3+ gifts this year), preview with a dry run, then let it sync nightly. Open source — fork it or ship your own.",
  category: "integrations",
  tier: "dev",
  priceMonthly: 19,
  scopes: ["giving", "people"],
  author: { name: "Community", url: "#" },
  accent: "#E0913B",
  Icon: Plug,
  Component: MailchimpSync,
  source: { type: "github", repo: "pconward/mailchimp-sync" },
};
