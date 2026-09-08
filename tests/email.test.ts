import { describe, expect, it } from "vitest";
import { detectEmails } from "../src/detection/email";

describe("email detection with synthetic data", () => {
  it.each([
    "ama.mensah@example.com", "AMA@example.org", "ama+study@example.com",
    "team@research.example.org", "a_b@example.com", "o'ama@example.com",
    "a@sample-team.example", "a".repeat(64) + "@example.com",
  ])("detects supported address %s", address => {
    expect(detectEmails(address)).toEqual([{
      id: `email:0:${address.length}`, category: "email", start: 0,
      end: address.length, text: address, detector: "rule",
    }]);
  });

  it.each([
    "", "No contact details here.", "@example.com", "ama@", "ama@example",
    "ama..mensah@example.com", ".ama@example.com", "ama.@example.com",
    "ama@@example.com", "ama@example..com", "ama@-example.com",
    "ama@example-.com", "ama@exam_ple.com", "ama@example.123",
    "ama@127.0.0.1", "amá@example.com", "ama@exámple.com",
    "a".repeat(65) + "@example.com", "a@" + "b".repeat(64) + ".com",
    "a".repeat(64) + "@" + ["b".repeat(63), "c".repeat(63), "d".repeat(61), "com"].join("."),
  ])("rejects malformed or unsupported candidate %s", input => {
    expect(detectEmails(input)).toEqual([]);
  });

  it("excludes surrounding punctuation and retains exact UTF-16 offsets", () => {
    const input = "📧 Contact: <ama@example.com>, then (kojo@example.org).";
    const result = detectEmails(input);
    expect(result.map(f => f.text)).toEqual(["ama@example.com", "kojo@example.org"]);
    expect(result[0]?.start).toBe(13);
    for (const finding of result) {
      expect(input.slice(finding.start, finding.end)).toBe(finding.text);
    }
  });

  it("returns separate occurrences in order and deterministic snapshot IDs", () => {
    const input = "ama@example.com\nama@example.com";
    const findings = detectEmails(input);
    expect(findings.map(f => [f.start, f.end])).toEqual([[0, 15], [16, 31]]);
    expect(new Set(findings.map(f => f.id)).size).toBe(2);
    expect(detectEmails(input)).toEqual(findings);
    expect(detectEmails("nothing")).toEqual([]);
  });
});
