// ── Shared UI kit for tools ─────────────────────────────────────────────
// Small, dependency-free building blocks so every tool looks consistent.
import React from "react";
import { Loader2 } from "lucide-react";

export const money = (cents) =>
  (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function Loading({ label = "Loading from Planning Center…" }) {
  return (
    <div className="tool-loading">
      <Loader2 size={26} className="spin" />
      <span>{label}</span>
    </div>
  );
}

export function StatCard({ label, value, sub, accent = "var(--brand)" }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: accent }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

// Simple, dependency-free horizontal bar list.
export function BarList({ rows, max, accent = "var(--brand)" }) {
  const top = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="barlist">
      {rows.map((r) => (
        <div className="barrow" key={r.label}>
          <div className="barrow-label">{r.label}</div>
          <div className="barrow-track">
            <div
              className="barrow-fill"
              style={{ width: `${(r.value / top) * 100}%`, background: r.color || accent }}
            />
          </div>
          <div className="barrow-val">{r.display ?? r.value}</div>
        </div>
      ))}
    </div>
  );
}

// Simple SVG line chart (single series).
export function LineChart({ points, height = 120, accent = "var(--brand)" }) {
  if (!points.length) return null;
  const w = 560, pad = 6;
  const max = Math.max(...points.map((p) => p.y));
  const min = Math.min(...points.map((p) => p.y));
  const span = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1 || 1);
  const coords = points.map((p, i) => {
    const x = pad + i * step;
    const y = pad + (height - pad * 2) * (1 - (p.y - min) / span);
    return [x, y];
  });
  const d = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${coords[coords.length - 1][0].toFixed(1)},${height - pad} L${coords[0][0].toFixed(1)},${height - pad} Z`;
  return (
    <svg className="linechart" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <path d={area} fill={accent} opacity="0.10" />
      <path d={d} fill="none" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Table({ columns, rows }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>{columns.map((c) => <th key={c.key} style={{ textAlign: c.align || "left" }}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align || "left" }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
