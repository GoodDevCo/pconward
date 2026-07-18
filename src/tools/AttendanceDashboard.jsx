import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Loading, StatCard, BarList, LineChart } from "../platform/ui.jsx";

function AttendanceDashboard({ client }) {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    let alive = true;
    (async () => {
      const { services, weeks } = await client.attendance({ weeks: 26 });
      if (!alive) return;
      const totals = weeks.map((w) => ({
        date: w.date,
        total: services.reduce((s, svc) => s + w.counts[svc], 0),
      }));
      const latest = totals[totals.length - 1];
      const prior = totals[totals.length - 2] || latest;
      const avg = Math.round(totals.reduce((s, t) => s + t.total, 0) / totals.length);
      const lastWeek = weeks[weeks.length - 1];
      const byService = services.map((svc) => ({ label: svc, value: lastWeek.counts[svc] }));
      setState({ loading: false, totals, latest, prior, avg, byService });
    })();
    return () => { alive = false; };
  }, [client]);

  if (state.loading) return <Loading />;
  const delta = state.latest.total - state.prior.total;

  return (
    <div>
      <div className="stat-row">
        <StatCard label="Last Sunday" value={state.latest.total.toLocaleString()} accent="#8A63D2"
          sub={`${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)} vs prior week`} />
        <StatCard label="26-week average" value={state.avg.toLocaleString()} />
        <StatCard label="High" value={Math.max(...state.totals.map((t) => t.total)).toLocaleString()} />
        <StatCard label="Low" value={Math.min(...state.totals.map((t) => t.total)).toLocaleString()} />
      </div>

      <h4 className="tool-h">Weekly attendance — last 26 weeks</h4>
      <div className="chart-card">
        <LineChart points={state.totals.map((t) => ({ y: t.total }))} accent="#8A63D2" />
        <div className="chart-axis">
          <span>{state.totals[0].date}</span>
          <span>{state.latest.date}</span>
        </div>
      </div>

      <h4 className="tool-h">Last Sunday by service</h4>
      <BarList accent="#8A63D2" rows={state.byService.map((s) => ({ ...s, display: s.value.toLocaleString() }))} />
    </div>
  );
}

export const manifest = {
  id: "attendance-dashboard",
  name: "Attendance Dashboard",
  tagline: "Weekly attendance trends across every service and Kids, at a glance.",
  description:
    "Turn Planning Center Check-Ins into a living dashboard: weekly totals, per-service breakdowns, week-over-week movement, and a 26-week trend line. Spot dips before they become problems.",
  category: "reports",
  tier: "easy",
  priceMonthly: 9,
  scopes: ["check_ins"],
  author: { name: "PCOnward", url: "#" },
  accent: "#8A63D2",
  Icon: BarChart3,
  Component: AttendanceDashboard,
};
