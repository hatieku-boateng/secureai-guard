import { detectEmails } from "./email";
import { detectGhanaCardPins } from "./ghana-card";
import { detectGhanaPhones } from "./ghana-phone";
import { detectInternationalPhones } from "./international-phone";
import type { Finding } from "./types";

export type InspectionResult = {
  text: string;
  findings: Finding[];
};

const categoryPriority: Record<Finding["category"], number> = {
  identifier: 4,
  email: 3,
  phone: 2,
  person: 1,
};

function overlaps(left: Finding, right: Finding): boolean {
  return left.start < right.end && right.start < left.end;
}

/** Keep one deterministic winner for duplicate or overlapping ranges. */
export function resolveFindings(findings: Finding[]): Finding[] {
  const ordered = [...findings].sort((left, right) => {
    const priority = categoryPriority[right.category] - categoryPriority[left.category];
    if (priority !== 0) return priority;
    const length = (right.end - right.start) - (left.end - left.start);
    if (length !== 0) return length;
    return left.id.localeCompare(right.id);
  });
  const accepted: Finding[] = [];
  for (const finding of ordered) {
    if (!accepted.some(existing => overlaps(existing, finding))) accepted.push(finding);
  }
  return accepted.sort((left, right) => left.start - right.start || right.end - left.end || left.id.localeCompare(right.id));
}

/** Run enabled local detectors against one immutable text snapshot. */
export function inspectText(text: string): InspectionResult {
  const findings = [
    ...detectEmails(text),
    ...detectGhanaPhones(text),
    ...detectInternationalPhones(text),
    ...detectGhanaCardPins(text),
  ];
  return { text, findings: resolveFindings(findings) };
}
