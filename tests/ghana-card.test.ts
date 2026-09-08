import { describe, expect, it } from "vitest";
import { detectGhanaCardPins } from "../src/detection/ghana-card";

describe("Ghana Card PIN shape detection", () => {
  it.each(["GHA-000000000-0", "GHA-123456789-1", "gha-987654321-9"])("detects %s", text => {
    expect(detectGhanaCardPins(text)).toEqual([{
      id: `identifier:ghana-card:0:${text.length}`, category: "identifier",
      start: 0, end: text.length, text, detector: "rule",
    }]);
  });

  it.each([
    "", "GHA-12345678-1", "GHA-1234567890-1", "GHA1234567891",
    "GHA/123456789/1", "GHA-123456789", "GHA-123456789-A",
    "GHA-123456789-12", "XGHA-123456789-1", "GHA-123456789-1X",
    "GHA-123456789-1@example.com", "GHA-123456789-1_2", "GHA 123456789 1",
  ])("rejects malformed or embedded candidate %s", text => {
    expect(detectGhanaCardPins(text)).toEqual([]);
  });

  it("preserves offsets and repeated occurrences", () => {
    const text = "📄 GHA-123456789-1; GHA-987654321-2.";
    const findings = detectGhanaCardPins(text);
    expect(findings.map(f => f.text)).toEqual(["GHA-123456789-1", "GHA-987654321-2"]);
    expect(findings[0]?.start).toBe(3);
    expect(new Set(findings.map(f => f.id)).size).toBe(2);
    for (const f of findings) expect(text.slice(f.start, f.end)).toBe(f.text);
    expect(detectGhanaCardPins(text)).toEqual(findings);
  });
});
