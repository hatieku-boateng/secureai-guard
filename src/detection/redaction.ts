import type { Finding } from "./types";

export type RedactionResult = {
  originalText: string;
  protectedText: string;
  redacted: Finding[];
};

const labels: Record<Finding["category"], string> = {
  person: "PERSON",
  email: "EMAIL",
  phone: "PHONE",
  identifier: "IDENTIFIER",
};

/** Replace selected ranges without mutating the original text or findings. */
export function redactSelected(text: string, selected: Finding[]): RedactionResult {
  const ordered = [...selected].sort((left, right) => left.start - right.start || left.end - right.end || left.id.localeCompare(right.id));
  const counters: Record<Finding["category"], number> = { person: 0, email: 0, phone: 0, identifier: 0 };
  let previousEnd = 0;
  for (const finding of ordered) {
    if (!Number.isInteger(finding.start) || !Number.isInteger(finding.end) || finding.start < 0 || finding.end <= finding.start || finding.end > text.length) {
      throw new Error(`Finding ${finding.id} has an invalid range`);
    }
    if (text.slice(finding.start, finding.end) !== finding.text) {
      throw new Error(`Finding ${finding.id} does not match the inspected text snapshot`);
    }
    if (finding.start < previousEnd) throw new Error("Selected findings overlap");
    previousEnd = finding.end;
  }

  let protectedText = "";
  let cursor = 0;
  for (const finding of ordered) {
    counters[finding.category] += 1;
    protectedText += text.slice(cursor, finding.start);
    protectedText += `[${labels[finding.category]}_${counters[finding.category]}]`;
    cursor = finding.end;
  }
  protectedText += text.slice(cursor);
  return { originalText: text, protectedText, redacted: ordered };
}
