import { describe, expect, it } from "vitest";
import { inspectText, resolveFindings } from "../src/detection/coordinator";
import type { Finding } from "../src/detection/types";

const finding = (id: string, category: Finding["category"], start: number, end: number): Finding => ({
  id, category, start, end, text: `${id}-value`, detector: "rule",
});

describe("inspection coordinator", () => {
  it("runs all current detectors against the same snapshot", () => {
    const text = "Email ama@example.com; phone 024 123 4567; card GHA-123456789-1; intl +1 202 555 0123.";
    const result = inspectText(text);
    expect(result.text).toBe(text);
    expect(result.findings.map(f => f.category)).toEqual(["email", "phone", "identifier", "phone"]);
    expect(result.findings.map(f => f.text)).toEqual([
      "ama@example.com", "024 123 4567", "GHA-123456789-1", "+1 202 555 0123",
    ]);
    for (const f of result.findings) expect(text.slice(f.start, f.end)).toBe(f.text);
  });

  it("removes exact duplicates and chooses the higher category priority for overlaps", () => {
    const result = resolveFindings([
      finding("phone", "phone", 0, 10),
      finding("email", "email", 2, 12),
      finding("identifier", "identifier", 2, 12),
      finding("duplicate", "phone", 20, 30),
      finding("phone-copy", "phone", 20, 30),
    ]);
    expect(result.map(f => f.id)).toEqual(["identifier", "duplicate"]);
  });

  it("uses longer same-priority ranges, then stable IDs, and sorts by position", () => {
    const result = resolveFindings([
      finding("z", "phone", 20, 25), finding("a", "phone", 20, 27),
      finding("later", "email", 40, 45), finding("earlier", "email", 5, 10),
    ]);
    expect(result.map(f => f.id)).toEqual(["earlier", "a", "later"]);
  });

  it("does not mutate the caller's findings array", () => {
    const input = [finding("b", "phone", 10, 15), finding("a", "email", 0, 5)];
    const copy = [...input];
    resolveFindings(input);
    expect(input).toEqual(copy);
  });
});
