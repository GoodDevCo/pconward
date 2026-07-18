// Registers every tool with the platform. A third-party tool is added by
// dropping its manifest import here (or, later, loading it from the registry
// service) — nothing else in the app needs to change.
import { registerTool } from "../platform/registry.js";
import { manifest as fundTotals } from "./FundTotals.jsx";
import { manifest as givingTrends } from "./GivingTrends.jsx";
import { manifest as attendanceDashboard } from "./AttendanceDashboard.jsx";
import { manifest as lapsedDonors } from "./LapsedDonors.jsx";
import { manifest as givingStatements } from "./GivingStatements.jsx";
import { manifest as servingGaps } from "./ServingGaps.jsx";
import { manifest as birthdaysMilestones } from "./BirthdaysMilestones.jsx";
import { manifest as mailchimpSync } from "./MailchimpSync.jsx";

[
  fundTotals,
  givingTrends,
  attendanceDashboard,
  lapsedDonors,
  givingStatements,
  servingGaps,
  birthdaysMilestones,
  mailchimpSync,
].forEach(registerTool);
