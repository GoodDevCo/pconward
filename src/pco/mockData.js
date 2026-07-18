// ── Mock Planning Center data ───────────────────────────────────────────
// Stands in for the real PCO API so tools are fully runnable in demo mode.
// The shapes mirror PCO's Giving / People / Check-Ins resources, so swapping
// in the live client (see client.js) needs no changes in the tools.

// Tiny seeded RNG so the demo data is identical on every load.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

export const ORG = { name: "Grace Community Church", pcoId: "demo-org" };

export const FUNDS = [
  { id: "f_general", name: "General Fund", color: "#4F7DF0" },
  { id: "f_missions", name: "Missions", color: "#3EA46B" },
  { id: "f_building", name: "Building Fund", color: "#E0913B" },
  { id: "f_benevolence", name: "Benevolence", color: "#C0563B" },
  { id: "f_youth", name: "Youth", color: "#8A63D2" },
];

const FIRST = ["James","Mary","Robert","Patricia","John","Jennifer","Michael","Linda","David","Elizabeth","William","Susan","Grace","Daniel","Sarah","Joseph","Karen","Mark","Nancy","Paul"];
const LAST = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Lee","Perez"];

export const PEOPLE = Array.from({ length: 120 }, (_, i) => {
  const name = `${pick(FIRST)} ${pick(LAST)}`;
  return {
    id: `p_${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`,
    joinedYear: 2015 + Math.floor(rand() * 11),
    // month 1-12, day 1-28 (kept simple), for the Birthdays & Milestones tool
    birthday: { month: 1 + Math.floor(rand() * 12), day: 1 + Math.floor(rand() * 28) },
  };
});

// 12 months of weekly giving, per person, weighted toward the General Fund.
function buildDonations() {
  const out = [];
  let id = 1;
  const now = new Date("2026-07-01T00:00:00Z");
  for (let w = 0; w < 52; w++) {
    const date = new Date(now.getTime() - w * 7 * 86400000).toISOString().slice(0, 10);
    for (const person of PEOPLE) {
      // Not everyone gives every week.
      if (rand() > 0.34) continue;
      const fund = rand() < 0.62 ? FUNDS[0] : pick(FUNDS);
      const base = fund.id === "f_building" ? 200 : fund.id === "f_general" ? 90 : 45;
      const amount = Math.round((base + rand() * base * 2) / 5) * 5;
      out.push({
        id: `d_${id++}`,
        personId: person.id,
        fundId: fund.id,
        amountCents: amount * 100,
        date,
      });
    }
  }
  return out;
}
export const DONATIONS = buildDonations();

// 52 weeks of check-ins across two services + kids ministry.
export const SERVICES = ["9:00 Service", "11:00 Service", "Kids"];
function buildAttendance() {
  const out = [];
  const now = new Date("2026-07-01T00:00:00Z");
  for (let w = 0; w < 52; w++) {
    const date = new Date(now.getTime() - w * 7 * 86400000).toISOString().slice(0, 10);
    const seasonal = 1 + 0.18 * Math.sin((w / 52) * Math.PI * 2); // gentle seasonality
    out.push({
      date,
      counts: {
        "9:00 Service": Math.round((180 + rand() * 40) * seasonal),
        "11:00 Service": Math.round((240 + rand() * 60) * seasonal),
        Kids: Math.round((70 + rand() * 25) * seasonal),
      },
    });
  }
  return out.reverse(); // oldest -> newest
}
export const ATTENDANCE = buildAttendance();

// Volunteer teams for the upcoming Sunday: how many spots each needs vs filled.
const TEAM_DEFS = [
  { team: "Kids Ministry", need: 18 },
  { team: "Greeters", need: 8 },
  { team: "Worship", need: 12 },
  { team: "Parking", need: 6 },
  { team: "Production / AV", need: 5 },
  { team: "Coffee & Hospitality", need: 7 },
  { team: "Prayer Team", need: 6 },
];
const ROLES_BY_TEAM = {
  "Kids Ministry": ["Nursery lead", "Elementary teacher", "Check-in host", "Room helper"],
  Greeters: ["Door greeter", "Info desk"],
  Worship: ["Vocalist", "Acoustic guitar", "Keys", "Drums"],
  Parking: ["Lot director", "Golf cart driver"],
  "Production / AV": ["Sound engineer", "Lyrics / ProPresenter", "Camera"],
  "Coffee & Hospitality": ["Barista", "Setup", "Cleanup"],
  "Prayer Team": ["Altar prayer", "Prayer room"],
};
export const SERVING = TEAM_DEFS.map(({ team, need }) => {
  const filled = Math.max(0, need - Math.floor(rand() * (need * 0.5)));
  const gap = need - filled;
  const roles = ROLES_BY_TEAM[team];
  const openRoles = Array.from({ length: gap }, () => ({
    role: pick(roles),
    service: rand() < 0.5 ? "9:00 Service" : "11:00 Service",
  }));
  return { team, need, filled, gap, openRoles };
});
