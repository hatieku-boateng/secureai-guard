import type { Finding } from "./types";

/** Ghana Card PIN shape heuristic; it does not validate a real person's number. */
export function detectGhanaCardPins(input: string): Finding[] {
  const findings: Finding[] = [];
  const pattern = /GHA-[0-9]{9}-[0-9]/gi;
  for (const match of input.matchAll(pattern)) {
    const start = match.index;
    const end = start + match[0].length;
    const before = input.slice(Math.max(0, start - 1), start);
    const after = input.slice(end, end + 1);
    if (/[\p{L}\p{N}_@-]/u.test(before) || /[\p{L}\p{N}_@-]/u.test(after)) continue;
    if (/^\.[\p{L}\p{N}_]/u.test(after)) continue;
    findings.push({ id: `identifier:ghana-card:${start}:${end}`, category: "identifier",
      start, end, text: match[0], detector: "rule" });
  }
  return findings;
}
