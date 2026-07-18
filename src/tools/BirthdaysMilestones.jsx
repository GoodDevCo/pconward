import React, { useEffect, useMemo, useState } from "react";
import { Cake } from "lucide-react";
import { Loading, StatCard, Table } from "../platform/ui.jsx";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TODAY = new Date("2026-07-01T00:00:00Z");
const YEAR = 2026;

function BirthdaysMilestones({ client }) {
  const [people, setPeople] = useState(null);
  const [window, setWindow] = useState(30);

  useEffect(() => {
    let alive = true;
    client.people().then((p) => alive && setPeople(p));
    return () => { alive = false; };
  }, [client]);

  const data = useMemo(() => {
    if (!people) return null;
    const upcoming = people.map((p) => {
      let d = new Date(Date.UTC(YEAR, p.birthday.month - 1, p.birthday.day));
      if (d < TODAY) d = new Date(Date.UTC(YEAR + 1, p.birthday.month - 1, p.birthday.day));
      const days = Math.round((d - TODAY) / 86400000);
      return { name: p.name, month: p.birthday.month, day: p.birthday.day, days };
    }).sort((a, b) => a.days - b.days);

    const milestones = people
      .map((p) => ({ name: p.name, years: YEAR - p.joinedYear, since: p.joinedYear }))
      .filter((m) => [5, 10, 15, 20].includes(m.years))
      .sort((a, b) => b.years - a.years);

    return { upcoming, milestones };
  }, [people]);

  if (!data) return <Loading />;
  const inWindow = data.upcoming.filter((b) => b.days <= window);
  const thisWeek = data.upcoming.filter((b) => b.days <= 7).length;

  return (
    <div>
      <div className="stat-row">
        <StatCard label="Birthdays this week" value={thisWeek} accent="#8A63D2" />
        <StatCard label={`Next ${window} days`} value={inWindow.length} />
        <StatCard label="Milestone members" value={data.milestones.length} accent="#3EA46B" />
        <StatCard label="People" value={people.length} />
      </div>

      <div className="tool-controls" style={{ marginTop: 18 }}>
        {[7, 30, 60].map((w) => (
          <button key={w} className={`chip ${window === w ? "chip-on" : ""}`} onClick={() => setWindow(w)}>
            Next {w} days
          </button>
        ))}
      </div>

      <h4 className="tool-h">Upcoming birthdays</h4>
      <Table
        columns={[
          { key: "name", label: "Person" },
          { key: "date", label: "Date", render: (r) => `${MONTHS[r.month - 1]} ${r.day}` },
          { key: "days", label: "In", align: "right", render: (r) => (r.days === 0 ? "Today" : `${r.days} days`) },
        ]}
        rows={inWindow}
      />

      <h4 className="tool-h">Membership milestones this year</h4>
      <Table
        columns={[
          { key: "name", label: "Person" },
          { key: "years", label: "Years", align: "right", render: (r) => `${r.years} years` },
          { key: "since", label: "Member since", align: "right" },
        ]}
        rows={data.milestones}
      />
    </div>
  );
}

export const manifest = {
  id: "birthdays-milestones",
  name: "Birthdays & Milestones",
  tagline: "Never miss a birthday or membership anniversary again.",
  description:
    "A warm, always-ready list of upcoming birthdays and membership milestones from Planning Center People — so pastors and care teams can send a card, make a call, or celebrate from the stage. Free, and a lovely first taste of what PCOnward can do.",
  category: "apps",
  tier: "easy",
  priceMonthly: 0,
  scopes: ["people"],
  author: { name: "PCOnward", url: "#" },
  accent: "#8A63D2",
  Icon: Cake,
  Component: BirthdaysMilestones,
};
