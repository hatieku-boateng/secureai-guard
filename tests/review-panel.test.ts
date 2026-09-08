import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { inspectText } from "../src/detection/coordinator";
import { createReviewPanel, type ReviewAction } from "../src/review/panel";

describe("review panel", () => {
  it("renders an accessible explanation, findings and safe text content", () => {
    const dom = new JSDOM();
    const inspection = inspectText("Email ama@example.com");
    const panel = createReviewPanel(dom.window.document, inspection, () => undefined);
    expect(panel.getAttribute("role")).toBe("dialog");
    expect(panel.getAttribute("aria-modal")).toBe("true");
    expect(panel.textContent).toContain("Review before sending");
    expect(panel.textContent).toContain("Email address: ama@example.com");
    expect(panel.querySelectorAll("input[type=checkbox]")).toHaveLength(1);
    expect(panel.querySelectorAll("button")).toHaveLength(4);
    expect(panel.querySelector("pre")?.textContent).toBe(inspection.text);
  });

  it("redacts only checked findings and updates the protected preview", () => {
    const dom = new JSDOM();
    const inspection = inspectText("Email ama@example.com; call 024 123 4567");
    const actions: ReviewAction[] = [];
    const panel = createReviewPanel(dom.window.document, inspection, action => actions.push(action));
    const boxes = panel.querySelectorAll<HTMLInputElement>("input[type=checkbox]");
    boxes[1]!.checked = false;
    panel.querySelector<HTMLButtonElement>("button")!.click();
    expect(actions[0]?.type).toBe("redact-selected");
    expect((actions[0] as Extract<ReviewAction, { type: "redact-selected" }>).result.protectedText).toBe("Email [EMAIL_1]; call 024 123 4567");
    expect(panel.querySelector("pre")?.textContent).toBe("Email [EMAIL_1]; call 024 123 4567");
  });

  it("emits edit, cancel and send-unchanged decisions", () => {
    const dom = new JSDOM();
    const actions: ReviewAction[] = [];
    const panel = createReviewPanel(dom.window.document, inspectText("a@example.com"), action => actions.push(action));
    const buttons = panel.querySelectorAll<HTMLButtonElement>("button");
    buttons[1]!.click(); buttons[2]!.click(); buttons[3]!.click();
    expect(actions.map(action => action.type)).toEqual(["edit", "cancel", "send-unchanged"]);
  });

  it("renders finding text as text instead of interpreting markup", () => {
    const dom = new JSDOM();
    const inspection = { text: "<script>alert(1)</script>", findings: [{ id: "x", category: "email" as const, start: 0, end: 22, text: "<script>alert(1)</script>", detector: "rule" as const }] };
    const panel = createReviewPanel(dom.window.document, inspection, () => undefined);
    expect(panel.querySelector("script")).toBeNull();
    expect(panel.textContent).toContain("<script>alert(1)</script>");
  });
});
