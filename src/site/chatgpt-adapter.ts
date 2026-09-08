export type ComposerSnapshot = { element: HTMLElement; text: string };

const selectors = [
  '[contenteditable="true"][data-lexical-editor="true"]',
  'textarea[placeholder*="Ask ChatGPT" i]',
  '[contenteditable="true"][aria-label*="ChatGPT" i]',
  '[contenteditable="true"]',
];

/** Find the first supported ChatGPT composer without modifying the page. */
export function findChatGptComposer(document: Document): HTMLElement | null {
  for (const selector of selectors) {
    const candidate = document.querySelector<HTMLElement>(selector);
    if (candidate && !candidate.closest("#secureai-guard-indicator")) return candidate;
  }
  return null;
}

export function readComposerText(element: HTMLElement): string {
  if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") return (element as HTMLInputElement).value;
  return element.innerText ?? element.textContent ?? "";
}

export function writeComposerText(element: HTMLElement, text: string): void {
  if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
    (element as HTMLInputElement).value = text;
  } else {
    element.textContent = text;
  }
  element.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: text }));
}

/** Capture a text snapshot for later inspection; this does not attach listeners. */
export function snapshotComposer(document: Document): ComposerSnapshot | null {
  const element = findChatGptComposer(document);
  return element ? { element, text: readComposerText(element) } : null;
}

export function isCurrentSnapshot(snapshot: ComposerSnapshot): boolean {
  return snapshot.element.isConnected && readComposerText(snapshot.element) === snapshot.text;
}

function isSendButton(element: Element): boolean {
  if (element.tagName !== "BUTTON") return false;
  const button = element as HTMLButtonElement;
  const label = `${button.getAttribute("aria-label") ?? ""} ${button.getAttribute("data-testid") ?? ""} ${button.textContent ?? ""}`;
  return /(?:send|submit|prompt-submit)/i.test(label);
}

export function findChatGptSendButton(document: Document): HTMLButtonElement | null {
  return Array.from(document.querySelectorAll<HTMLButtonElement>("button")).find(button => isSendButton(button)) ?? null;
}

export type SubmitInterceptionController = {
  cleanup: () => void;
  allowNextSubmit: (snapshot: ComposerSnapshot) => void;
  setEnabled: (enabled: boolean) => void;
  isEnabled: () => boolean;
};

/** Pause supported send attempts and hand the current snapshot to the caller. */
export function installSubmitInterception(document: Document, onSubmitAttempt: (snapshot: ComposerSnapshot, event: Event) => boolean): SubmitInterceptionController {
  let allowedSnapshot: ComposerSnapshot | null = null;
  let enabled = false;
  const shouldBypass = (snapshot: ComposerSnapshot): boolean => {
    if (!allowedSnapshot) return false;
    const allowed = allowedSnapshot.element === snapshot.element && allowedSnapshot.text === snapshot.text;
    allowedSnapshot = null;
    return allowed;
  };
  const handleClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof document.defaultView!.Element) || !isSendButton(target.closest("button") ?? target)) return;
    const snapshot = snapshotComposer(document);
    if (!snapshot || !snapshot.text.trim()) return;
    if (!enabled) return;
    if (shouldBypass(snapshot)) return;
    if (onSubmitAttempt(snapshot, event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    const target = event.target;
    if (!(target instanceof document.defaultView!.HTMLElement) || !target.matches('[contenteditable="true"], textarea')) return;
    const snapshot = snapshotComposer(document);
    if (!snapshot || !snapshot.text.trim()) return;
    if (!enabled) return;
    if (shouldBypass(snapshot)) return;
    if (onSubmitAttempt(snapshot, event)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  document.addEventListener("click", handleClick, true);
  document.addEventListener("keydown", handleKeydown, true);
  return {
    allowNextSubmit: snapshot => { allowedSnapshot = snapshot; },
    setEnabled: value => { enabled = value; if (!value) allowedSnapshot = null; },
    isEnabled: () => enabled,
    cleanup: () => {
    document.removeEventListener("click", handleClick, true);
    document.removeEventListener("keydown", handleKeydown, true);
    },
  };
}
