import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { Loading, StatCard, BarList, Table } from "../platform/ui.jsx";

function ServingGaps({ client }) {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let alive = true;
    (async () => {
      const teams = await client.serving();
      if (!alive) return;
      setState({ loading: false, teams });
    })();
    return () => { alive = false; };
  }, [client]);

  if (state.loading) return <Loading label="Reading Planning Center Services…" />;

  const totalNeed = state.teams.reduce((s, t) => s + t.need, 0);
  const totalFilled = state.teams.reduce((s, t) => s + t.filled, 0);
  const totalGap = totalNeed - totalFilled;
  const coverage = Math.round((totalFilled / totalNeed) * 100);
  const openRows = state.teams.flatMap((t) => t.openRoles.map((r) => ({ team: t.team, ...r })));
  const short = [...state.teams].filter((t) => t.gap > 0).sort((a, b) => b.gap - a.gap);

  return (
    <div>
      <div className="stat-row">
        <StatCard label="Open spots this Sunday" value={totalGap} accent="#D69A3C" />
        <StatCard label="Coverage" value={`${coverage}%`} accent={coverage >= 85 ? "#3EA46B" : "#D69A3C"} />
        <StatCard label="Teams short" value={short.length} />
        <StatCard label="Volunteers needed" value={totalNeed} sub={`${totalFilled} confirmed`} />
      </div>

      <h4 className="tool-h">Coverage by team</h4>
      <BarList
        rows={state.teams.map((t) => ({
          label: t.team,
          value: t.filled,
          display: `${t.filled}/${t.need}`,
          color: t.gap === 0 ? "#3EA46B" : t.gap >= 3 ? "#C0563B" : "#D69A3C",
        }))}
        max={Math.max(...state.teams.map((t) => t.need))}
      />

      <h4 className="tool-h">Open roles to fill</h4>
      <Table
        columns={[
          { key: "team", label: "Team" },
          { key: "role", label: "Role" },
          { key: "service", label: "Service" },
        ]}
        rows={openRows}
      />
      {openRows.length === 0 && <div className="empty">Every team is fully staffed this week. 🎉</div>}
    </div>
  );
}

export const manifest = {
  id: "serving-gaps",
  name: "Serving Gaps",
  tagline: "See which volunteer teams are short this week — and the exact open roles.",
  description:
    "Sunday's a lot less stressful when you can see the gaps on Wednesday. Pulls your Planning Center Services teams and shows coverage at a glance: who's fully staffed, who's short, and every unfilled role by service — so you know exactly who to text.",
  category: "apps",
  tier: "easy",
  priceMonthly: 12,
  scopes: ["services", "people"],
  author: { name: "PCOnward", url: "#" },
  accent: "#D69A3C",
  Icon: Users,
  Component: ServingGaps,
};
