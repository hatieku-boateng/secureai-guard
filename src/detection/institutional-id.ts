import type { Finding } from "./types";

/** Context-based placeholder for institution-specific student/employee identifiers. */
export function detectInstitutionalIds(input: string): Finding[] {
  const findings: Finding[] = [];
  const pattern = /\b(?:student|learner|employee|staff)\s*(?:identification|id|number|no\.?)\s*(?=[ \t:#-]|$)[ \t]*(?:is|:|#|-)?[ \t]*([A-Z0-9][A-Z0-9/-]{3,19})(?![A-Z0-9/-])/gi;
  for (const match of input.matchAll(pattern)) {
    const value = match[1];
    const full = match[0];
    if (!value || !/[0-9]/.test(value)) continue;
    const trailing = input.slice(match.index + full.length, match.index + full.length + 2);
    if (/^\.[A-Z0-9]/i.test(trailing)) continue;
    const relative = full.lastIndexOf(value);
    const start = match.index + relative;
    const end = start + value.length;
    findings.push({ id: `identifier:institutional:${start}:${end}`, category: "identifier",
      start, end, text: value, detector: "rule" });
  }
  return findings;
}
