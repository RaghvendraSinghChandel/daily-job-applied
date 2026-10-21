// Regenerates JOBS.md (the human-readable view of every tracked job) from tracker.json.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const tracker = JSON.parse(readFileSync("tracker.json", "utf8"));
const cell = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const statusOrder = ["awaiting_approval", "not_applied", "applied", "closed", "rejected"];

const jobs = [...tracker.jobs].sort(
  (a, b) =>
    statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) ||
    (b.score ?? 0) - (a.score ?? 0)
);

const header =
  "| Score | Title | Company | Location | Mode | Exp. | Key skills | Salary | Posted | Status | Recommendation |\n" +
  "|---|---|---|---|---|---|---|---|---|---|---|";
const row = (j) =>
  `| ${j.score ?? ""} | [${cell(j.title)}](${j.url}) | ${cell(j.company)} | ${cell(j.location)} | ${cell(j.work_mode)} | ${cell(j.experience)} | ${cell(j.skills)} | ${cell(j.salary)} | ${cell(j.posted)} | ${cell(j.status)} | ${cell(j.recommendation)} |`;

const reports = readdirSync("reports").filter((f) => f.endsWith(".md")).sort().reverse();

let out = `# All tracked jobs\n\nLast run: **${tracker.last_run}** · ${jobs.length} jobs tracked · resume: \`${tracker.resume}\`\n\n`;
for (const status of statusOrder) {
  const group = jobs.filter((j) => j.status === status);
  if (!group.length) continue;
  out += `## ${status.replace("_", " ")} (${group.length})\n\n${header}\n${group.map(row).join("\n")}\n\n`;
}
const other = jobs.filter((j) => !statusOrder.includes(j.status));
if (other.length) out += `## other (${other.length})\n\n${header}\n${other.map(row).join("\n")}\n\n`;

out += `## Excluded (${tracker.excluded.length})\n\n| Company | Title | Reason |\n|---|---|---|\n`;
out += tracker.excluded.map((e) => `| ${cell(e.company)} | ${cell(e.title)} | ${cell(e.reason)} |`).join("\n");
out += `\n\n## Daily reports\n\n${reports.map((r) => `- [${r.replace(".md", "")}](reports/${r})`).join("\n")}\n`;

writeFileSync("JOBS.md", out);
console.log(`JOBS.md: ${jobs.length} jobs, ${tracker.excluded.length} excluded, ${reports.length} reports`);
