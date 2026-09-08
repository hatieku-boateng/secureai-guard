import { describe, expect, it } from "vitest";
import { detectInternationalPhones } from "../src/detection/international-phone";

// Synthetic examples; valid format does not establish that a number is unassigned.
describe("explicit international phone formats", () => {
  it.each([
    "+1 202 555 0123", "+44 20 7946 0123", "+44 7911 123456",
    "+234 803 123 4567", "+254 712 123456", "+27 82 123 4567",
    "+33 6 12 34 56 78", "+49 1512 3456789", "+91 98765 43210",
    "0044 20 7946 0123", "+1 (202) 555-0123", "+12025550123",
  ])("detects %s", text => {
    expect(detectInternationalPhones(text)).toEqual([{
      id: `phone:intl:0:${text.length}`, category: "phone", start: 0,
      end: text.length, text, detector: "rule",
    }]);
  });

  it.each([
    "", "+44 7700 900123", "2026-09-08", "020 7946 0123", "2025550123", "112",
    "+999 123456789", "+1 202 555", "+1 202 555 012345678",
    "ID+12025550123", "+12025550123abc", "+12025550123@example.com",
    "++12025550123", "+1 (202 555-0123", "+1 202) 555-0123",
    "+1 202--555-0123", "+233 24 123 4567", "00233 24 123 4567",
    "0241234567", "+1 202 555 0123 99", "+12025550123.45",
  ])("rejects or delegates %s", text => {
    expect(detectInternationalPhones(text)).toEqual([]);
  });

  it("preserves Unicode offsets, punctuation and repeated occurrences", () => {
    const text = "📞 Call +1 202 555 0123; then +1 202 555 0123.";
    const findings = detectInternationalPhones(text);
    expect(findings.map(f => f.text)).toEqual(["+1 202 555 0123", "+1 202 555 0123"]);
    expect(findings[0]?.start).toBe(8);
    expect(new Set(findings.map(f => f.id)).size).toBe(2);
    for (const f of findings) expect(text.slice(f.start, f.end)).toBe(f.text);
    expect(detectInternationalPhones(text)).toEqual(findings);
  });
});
