import { describe, expect, it } from "vitest";
import { detectGhanaPhones } from "../src/detection/ghana-phone";

// Invented fixtures, not contact records or guaranteed unassigned numbers.
describe("Ghana phone format detection", () => {
  it.each([
    "0241234567", "024 123 4567", "024-123-4567", "059 123 4567",
    "0531234567", "0302 123456", "032 212 3456", "+233241234567",
    "+233 24 123 4567", "+233-24-123-4567", "00233 24 123 4567",
    "+233 302 123456", "+233 (0)24 123 4567", "00233 (0)302 123456",
    "024\u00a0123\u00a04567", "024\t123\t4567",
  ])("detects %s and preserves formatting", text => {
    expect(detectGhanaPhones(text)).toEqual([{
      id: `phone:gh:0:${text.length}`, category: "phone", start: 0,
      end: text.length, text, detector: "rule",
    }]);
  });

  it.each([
    "", "No phone supplied", "112", "024123456", "02412345678",
    "+233 024 123 4567", "233241234567", "241234567",
    "+234241234567", "0044241234567", "0141234567", "0441234567",
    "0641234567", "0741234567", "0800123456", "0900123456",
    "ID0241234567", "0241234567abc", "GH-0241234567-1",
    "0241234567@example.com", "é0241234567", "0241234567é",
    "10241234567", "++233241234567", "024--123-4567",
    "024 123\n4567", "+233 (1)24 123 4567", "024.123.4567",
    "2026-09-08", "0241234567 99", "0241234567.89",
  ])("rejects unsupported or malformed candidate %s", text => {
    expect(detectGhanaPhones(text)).toEqual([]);
  });

  it("handles surrounding punctuation, repeats and UTF-16 offsets", () => {
    const text = "☎️ (024 123 4567), +233 24 123 4567.\n024 123 4567";
    const findings = detectGhanaPhones(text);
    expect(findings.map(f => f.text)).toEqual([
      "024 123 4567", "+233 24 123 4567", "024 123 4567",
    ]);
    expect(findings[0]?.start).toBe(4);
    expect(new Set(findings.map(f => f.id)).size).toBe(3);
    for (const finding of findings) {
      expect(text.slice(finding.start, finding.end)).toBe(finding.text);
    }
    expect(detectGhanaPhones(text)).toEqual(findings);
  });

  it("does not silently split an ambiguous numeric run into two phone numbers", () => {
    expect(detectGhanaPhones("0241234567 0591234567")).toEqual([]);
    expect(detectGhanaPhones("0241234567, 0591234567")).toHaveLength(2);
  });
});
