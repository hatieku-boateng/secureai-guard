import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import type { Finding } from "./types";

/** Explicit + or 00 international forms only; Ghana is handled by its own rule. */
export function detectInternationalPhones(input: string): Finding[] {
  const findings: Finding[] = [];
  const candidates = /(?:\+|00)[0-9](?:[0-9 \t\u00a0()\-]*[0-9])?/g;
  for (const match of input.matchAll(candidates)) {
    const text = match[0];
    const start = match.index;
    const end = start + text.length;
    const before = input.slice(Math.max(0, start - 2), start);
    const after = input.slice(end, end + 2);
    if (/[\p{L}\p{N}\p{M}_@.+-]$/u.test(before)) continue;
    if (/^[\p{L}\p{N}\p{M}_@+-]/u.test(after) || /^\.[\p{L}\p{N}_]/u.test(after)) continue;
    // Parentheses must contain digits and balance; do not repair malformed input.
    const ungrouped = text.replace(/\([0-9]+\)/g, "");
    if (/[()]/.test(ungrouped) || /--/.test(text)) continue;
    const normalized = text.startsWith("00") ? `+${text.slice(2)}` : text;
    const number = parsePhoneNumberFromString(normalized, { extract: false });
    if (!number?.isValid() || number.countryCallingCode === "233") continue;
    findings.push({ id: `phone:intl:${start}:${end}`, category: "phone",
      start, end, text, detector: "rule" });
  }
  return findings;
}
