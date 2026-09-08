import { describe, expect, it } from "vitest";
import { redactSelected } from "../src/detection/redaction";
import { inspectText } from "../src/detection/coordinator";

describe("selected finding redaction", () => {
  it("creates a preview with meaningful per-category placeholders", () => {
    const text = "Email ama@example.com; call 024 123 4567; card GHA-123456789-1.";
    const findings = inspectText(text).findings;
    const result = redactSelected(text, [findings[2]!, findings[0]!, findings[1]!]);
    expect(result.originalText).toBe(text);
    expect(result.protectedText).toBe("Email [EMAIL_1]; call [PHONE_1]; card [IDENTIFIER_1].");
    expect(result.redacted.map(f => f.text)).toEqual(["ama@example.com", "024 123 4567", "GHA-123456789-1"]);
    expect(text).toBe("Email ama@example.com; call 024 123 4567; card GHA-123456789-1.");
  });

  it("numbers repeated categories in text order and leaves unselected findings unchanged", () => {
    const text = "a@example.com then b@example.org and 024 123 4567";
    const findings = inspectText(text).findings;
    const result = redactSelected(text, [findings[1]!, findings[2]!]);
    expect(result.protectedText).toBe("a@example.com then [EMAIL_1] and [PHONE_1]");
  });

  it("rejects stale findings whose snapshot no longer matches", () => {
    const finding = inspectText("Contact a@example.com").findings[0]!;
    expect(() => redactSelected("Contact b@example.com", [finding])).toThrow(/snapshot/);
  });

  it("rejects invalid and overlapping ranges", () => {
    const base = { id: "x", category: "email" as const, text: "abcd", detector: "rule" as const };
    expect(() => redactSelected("abcd", [{ ...base, start: -1, end: 3 }])).toThrow(/invalid range/);
    expect(() => redactSelected("abcdef", [
      { ...base, id: "a", start: 0, end: 4 },
      { ...base, id: "b", start: 3, end: 6, text: "def" },
    ])).toThrow(/overlap/);
  });

  it("returns the original text when nothing is selected", () => {
    expect(redactSelected("Nothing to hide", []).protectedText).toBe("Nothing to hide");
  });
});
