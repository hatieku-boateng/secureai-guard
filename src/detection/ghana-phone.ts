import type { Finding } from "./types";

/** Ghana 02/03/05-family format heuristic, not assignment or ownership validation. */
export function detectGhanaPhones(input: string): Finding[] {
  const findings: Finding[] = [];
  // Consume the complete numeric run to avoid taking ten digits from a longer ID.
  // Horizontal spacing is allowed; a line break separates candidates.
  const candidates = /\+?[0-9](?:[0-9 \t\u00a0()\-]*[0-9])?/g;
  for (const match of input.matchAll(candidates)) {
    const text = match[0];
    const start = match.index;
    const end = start + text.length;
    const before = input.slice(Math.max(0, start - 2), start);
    const after = input.slice(end, end + 2);
    // Do not extract fragments from words, email addresses or identifier strings.
    if (/[\p{L}\p{N}\p{M}_@.+-]$/u.test(before)) continue;
    if (/^[\p{L}\p{N}\p{M}_@+-]/u.test(after) || /^\.[\p{L}\p{N}_]/u.test(after)) continue;

    // Accept the common printed optional trunk marker: +233 (0)24 ...
    const formatted = text.replace(/^(\+233|00233)[ \t\u00a0]*\(0\)[ \t\u00a0]*/, "$1");
    if (/[()]/.test(formatted) || /--/.test(formatted)) continue;
    const compact = formatted.replace(/[ \t\u00a0-]/g, "");
    if (!/^(?:0|\+233|00233)[235][0-9]{8}$/.test(compact)) continue;

    findings.push({ id: `phone:gh:${start}:${end}`, category: "phone",
      start, end, text, detector: "rule" });
  }
  return findings;
}
