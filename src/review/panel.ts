import type { InspectionResult } from "../detection/coordinator";
import { redactSelected } from "../detection/redaction";
import type { Finding } from "../detection/types";

export type ReviewAction =
  | { type: "redact-selected"; result: ReturnType<typeof redactSelected> }
  | { type: "edit" }
  | { type: "cancel" }
  | { type: "send-unchanged" };

const categoryLabels: Record<Finding["category"], string> = {
  person: "Likely name", email: "Email address", phone: "Phone number", identifier: "Identifier",
};

/** Create an accessible, DOM-only review panel. It never submits or edits the host page. */
export function createReviewPanel(document: Document, inspection: InspectionResult, onAction: (action: ReviewAction) => void): HTMLElement {
  const panel = document.createElement("section");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "secureai-review-title");
  panel.className = "secureai-review-panel";

  const title = document.createElement("h2");
  title.id = "secureai-review-title";
  title.textContent = "Review before sending";
  const explanation = document.createElement("p");
  explanation.textContent = "SecureAI Guard found information that may be sensitive. Choose what to redact, edit the prompt, cancel, or deliberately send it unchanged.";
  panel.append(title, explanation);

  const list = document.createElement("ul");
  list.setAttribute("aria-label", "Detected information");
  for (const finding of inspection.findings) {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.dataset.findingId = finding.id;
    const text = document.createElement("span");
    text.textContent = `${categoryLabels[finding.category]}: ${finding.text}`;
    label.append(checkbox, text);
    item.append(label);
    list.append(item);
  }
  panel.append(list);

  const previewLabel = document.createElement("h3");
  previewLabel.textContent = "Protected preview";
  const preview = document.createElement("pre");
  preview.setAttribute("aria-live", "polite");
  preview.textContent = inspection.text;
  panel.append(previewLabel, preview);

  const selectedFindings = (): Finding[] => {
    const ids = new Set(Array.from(panel.querySelectorAll<HTMLInputElement>("input[type=checkbox]:checked"), input => input.dataset.findingId));
    return inspection.findings.filter(finding => ids.has(finding.id));
  };
  const redactButton = document.createElement("button");
  redactButton.type = "button";
  redactButton.textContent = "Redact selected";
  redactButton.addEventListener("click", () => {
    const result = redactSelected(inspection.text, selectedFindings());
    preview.textContent = result.protectedText;
    onAction({ type: "redact-selected", result });
  });
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => onAction({ type: "edit" }));
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", () => onAction({ type: "cancel" }));
  const unchangedButton = document.createElement("button");
  unchangedButton.type = "button";
  unchangedButton.textContent = "Send unchanged";
  unchangedButton.addEventListener("click", () => onAction({ type: "send-unchanged" }));
  const actions = document.createElement("div");
  actions.className = "secureai-review-actions";
  actions.append(redactButton, editButton, cancelButton, unchangedButton);
  panel.append(actions);
  return panel;
}
