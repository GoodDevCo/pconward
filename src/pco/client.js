// ── PCO data client ─────────────────────────────────────────────────────
// One abstraction every tool reads through. In demo mode it serves the mock
// data; in production the SAME methods hit the Planning Center API with the
// church's OAuth token — so tools never change when you flip to live data.
//
// To go live: implement `liveClient` to call https://api.planningcenteronline.com
// with the org's access token, then have createClient() return it when a token
// is present. Tool code stays identical.

import { FUNDS, DONATIONS, PEOPLE, ATTENDANCE, SERVICES, SERVING, ORG } from "./mockData.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function demoClient() {
  return {
    mode: "demo",
    org: ORG,

    async listFunds() {
      await delay(150);
      return FUNDS;
    },

    // Giving rows, optionally filtered by fund and date window (ISO strings).
    async giving({ fundId = null, since = null, until = null } = {}) {
      await delay(220);
      return DONATIONS.filter(
        (d) =>
          (!fundId || d.fundId === fundId) &&
          (!since || d.date >= since) &&
          (!until || d.date <= until)
      );
    },

    async people() {
      await delay(150);
      return PEOPLE;
    },

    async attendance({ weeks = 52 } = {}) {
      await delay(200);
      return { services: SERVICES, weeks: ATTENDANCE.slice(-weeks) };
    },

    async serving() {
      await delay(180);
      return SERVING;
    },
  };
}

// Placeholder for the real integration (wired during the OAuth milestone).
// function liveClient(token) { ... fetch api.planningcenteronline.com ... }

export function createClient(session) {
  // if (session?.token) return liveClient(session.token);
  return demoClient();
}
