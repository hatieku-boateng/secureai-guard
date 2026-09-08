import { inspectText } from "./detection/coordinator";
import { createReviewPanel } from "./review/panel";
import { findChatGptSendButton, installSubmitInterception, isCurrentSnapshot, writeComposerText } from "./site/chatgpt-adapter";

// The indicator is always visible; inspection begins only when a supported send is attempted.
const indicatorId = "secureai-guard-indicator";
let interception: ReturnType<typeof installSubmitInterception> | null = null;

if (!document.getElementById(indicatorId)) {
  const host = document.createElement("div");
  host.id = indicatorId;
  // Shadow DOM keeps the indicator's styles separate from the host page.
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host {
      all: initial;
      position: fixed;
      bottom: 16px;
      left: 16px;
      z-index: 2147483647;
      max-width: calc(100vw - 32px);
      color-scheme: light;
    }
    .indicator {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border: 1px solid #64748b;
      border-radius: 12px;
      background: #f8fafc;
      color: #0f172a;
      box-shadow: 0 3px 14px #0002;
      font: 13px/1.5 system-ui, sans-serif;
      overflow-wrap: anywhere;
    }
    strong, span { display: block; }
    span { color: #475569; }
    button {
      flex: none;
      width: 32px;
      height: 32px;
      border: 1px solid #94a3b8;
      border-radius: 6px;
      background: white;
      color: #0f172a;
      font: 13px/1.2 system-ui, sans-serif;
      cursor: pointer;
    }
    button:hover { background: #e2e8f0; }
    button:first-of-type { width: auto; height: auto; padding: 7px 9px; }
    button:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
  `;

  const panel = document.createElement("section");
  panel.className = "indicator";
  panel.setAttribute("aria-label", "SecureAI Guard prototype status");
  const label = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = "SecureAI Guard";
  const status = document.createElement("span");
  status.textContent = "Protection off · checking not active";
  label.append(title, status);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.textContent = "Turn on protection";
  toggle.setAttribute("aria-pressed", "false");
  toggle.title = "Enable local review for this page session";
  toggle.addEventListener("click", () => {
    if (!interception) return;
    const enabled = !interception.isEnabled();
    interception.setEnabled(enabled);
    toggle.textContent = enabled ? "Turn off protection" : "Turn on protection";
    toggle.setAttribute("aria-pressed", String(enabled));
    status.textContent = enabled ? "Protection on · local checking active" : "Protection off · checking not active";
  });

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.textContent = "×";
  dismiss.setAttribute("aria-label", "Dismiss SecureAI Guard indicator");
  dismiss.title = "Hide until the page is reloaded";
  dismiss.addEventListener("click", () => host.remove(), { once: true });

  panel.append(label, toggle, dismiss);
  shadow.append(style, panel);
  document.documentElement.append(host);
}

const reviewHostId = "secureai-guard-review";
interception = installSubmitInterception(document, (snapshot) => {
  const inspection = inspectText(snapshot.text);
  if (inspection.findings.length === 0) return false;
  document.getElementById(reviewHostId)?.remove();
  const reviewHost = document.createElement("div");
  reviewHost.id = reviewHostId;
  reviewHost.style.cssText = "all: initial; position: fixed; inset: 0; z-index: 2147483646; display: grid; place-items: center; padding: 24px; background: #0008;";
  const shadow = reviewHost.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host { font-family: system-ui, sans-serif; color-scheme: light; }
    .secureai-review-panel { box-sizing: border-box; width: min(680px, 100%); max-height: min(720px, 100%); overflow: auto; padding: 24px; border-radius: 16px; background: #fff; color: #0f172a; box-shadow: 0 20px 60px #0006; }
    h2 { margin: 0 0 8px; font: 700 20px/1.3 system-ui, sans-serif; } h3 { margin: 20px 0 8px; font-size: 15px; }
    p { margin: 0 0 16px; line-height: 1.5; } ul { padding: 0; margin: 0; list-style: none; } li { margin: 8px 0; } label { display: flex; gap: 10px; align-items: flex-start; } input { width: 18px; height: 18px; flex: none; } pre { padding: 12px; max-height: 180px; overflow: auto; white-space: pre-wrap; border-radius: 8px; background: #f1f5f9; font: 13px/1.5 ui-monospace, monospace; } button { margin: 8px 8px 0 0; padding: 9px 12px; border: 1px solid #94a3b8; border-radius: 8px; background: #fff; color: #0f172a; cursor: pointer; } button:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; } button:first-child { background: #0f172a; color: #fff; }
  `;
  const panel = createReviewPanel(document, inspection, (action) => {
    if (action.type === "redact-selected" && isCurrentSnapshot(snapshot)) writeComposerText(snapshot.element, action.result.protectedText);
    if (action.type === "send-unchanged") {
      reviewHost.remove();
      interception?.allowNextSubmit(snapshot);
      window.setTimeout(() => findChatGptSendButton(document)?.click(), 0);
    }
    if (action.type === "edit" || action.type === "cancel" || action.type === "redact-selected") reviewHost.remove();
  });
  shadow.append(style, panel);
  document.documentElement.append(reviewHost);
  panel.querySelector<HTMLButtonElement>("button")?.focus();
  return true;
});
