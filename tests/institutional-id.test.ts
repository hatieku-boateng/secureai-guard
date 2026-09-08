import { describe, expect, it } from "vitest";
import { detectInstitutionalIds } from "../src/detection/institutional-id";

describe("context-based institutional identifier detection", () => {
  it.each([
    ["Student ID: KNUST-2026-0042", "KNUST-2026-0042"],
    ["student number is UE-ABC-1234", "UE-ABC-1234"],
    ["Learner No. #STU/2025/0099", "STU/2025/0099"],
    ["Employee ID: HR-00421", "HR-00421"],
    ["staff identification - FIN-2026-18", "FIN-2026-18"],
    ["EMPLOYEE NUMBER is emp-77a9", "emp-77a9"],
  ])("detects labelled synthetic identifier in %s", (input, value) => {
    const findings = detectInstitutionalIds(input);
    const start = input.indexOf(value);
    expect(findings).toEqual([{
      id: `identifier:institutional:${start}:${start + value.length}`,
      category: "identifier", start, end: start + value.length,
      text: value, detector: "rule",
    }]);
  });

  it.each([
    "20260042", "Phone number: 0241234567", "Student name: Ama Mensah",
    "student ID: 123", "employee number: 12", "student identifier: AB",
    "student ID: this-is-too-long-for-a-local-id-123", "student ID: 2026.0042",
    "student ID KNUST 2026", "student email: ama@example.com",
  ])("does not flag unlabelled, short or unsupported value %s", input => {
    expect(detectInstitutionalIds(input)).toEqual([]);
  });

  it("preserves multiple occurrences and UTF-16 offsets", () => {
    const input = "🎓 Student ID: ABC-1234; employee no: HR-88";
    const findings = detectInstitutionalIds(input);
    expect(findings.map(f => f.text)).toEqual(["ABC-1234", "HR-88"]);
    for (const f of findings) expect(input.slice(f.start, f.end)).toBe(f.text);
    expect(new Set(findings.map(f => f.id)).size).toBe(2);
  });
});
