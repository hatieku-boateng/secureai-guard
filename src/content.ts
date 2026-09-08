// This shell only adds an indicator. It does not read or intercept prompts.
const indicatorId = "secureai-guard-indicator";

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
      font: 20px/1 system-ui, sans-serif;
      cursor: pointer;
    }
    button:hover { background: #e2e8f0; }
    button:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
  `;

  const panel = document.createElement("section");
  panel.className = "indicator";
  panel.setAttribute("aria-label", "SecureAI Guard prototype status");
  const label = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = "SecureAI Guard";
  const status = document.createElement("span");
  status.textContent = "Checking not active";
  label.append(title, status);

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.textContent = "×";
  dismiss.setAttribute("aria-label", "Dismiss SecureAI Guard indicator");
  dismiss.title = "Hide until the page is reloaded";
  dismiss.addEventListener("click", () => host.remove(), { once: true });

  panel.append(label, dismiss);
  shadow.append(style, panel);
  document.documentElement.append(host);
}
