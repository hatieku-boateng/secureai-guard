import type { Finding } from "./types";

/** Practical ASCII email detection, not mailbox verification or full RFC parsing. */
export function detectEmails(input: string): Finding[] {
  const findings: Finding[] = [];
  // Consume whole candidates, including unsupported Unicode and repeated @ signs,
  // so malformed addresses do not accidentally produce valid-looking substrings.
  const candidates = /[\p{L}\p{N}\p{M}.!#$%&'*+\-/=?^_`{|}~@]+/gu;
  for (const match of input.matchAll(candidates)) {
    const value = match[0].replace(/\.+$/, ""); // Sentence-ending full stops.
    const parts = value.split("@");
    if (parts.length !== 2) continue;
    const [local = "", domain = ""] = parts;
    if (value.length > 254 || local.length > 64 || !local || !domain) continue;
    if (!/^[a-z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[a-z0-9!#$%&'*+\-/=?^_`{|}~]+)*$/i.test(local)) continue;
    const labels = domain.split(".");
    if (labels.length < 2) continue;
    if (!labels.every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))) continue;
    if (!/^[a-z]{2,63}$/i.test(labels.at(-1) ?? "")) continue;

    const start = match.index;
    const end = start + value.length;
    findings.push({
      id: `email:${start}:${end}`,
      category: "email",
      start,
      end,
      text: value,
      detector: "rule",
    });
  }
  return findings;
}
