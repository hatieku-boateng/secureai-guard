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

/** Capture a text snapshot for later inspection; this does not attach listeners. */
export function snapshotComposer(document: Document): ComposerSnapshot | null {
  const element = findChatGptComposer(document);
  return element ? { element, text: readComposerText(element) } : null;
}

function isSendButton(element: Element): boolean {
  if (element.tagName !== "BUTTON") return false;
  const button = element as HTMLButtonElement;
  const label = `${button.getAttribute("aria-label") ?? ""} ${button.getAttribute("data-testid") ?? ""} ${button.textContent ?? ""}`;
  return /(?:send|submit|prompt-submit)/i.test(label);
}

/** Pause supported send attempts and hand the current snapshot to the caller. */
export function installSubmitInterception(document: Document, onSubmitAttempt: (snapshot: ComposerSnapshot, event: Event) => void): () => void {
  const handleClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof document.defaultView!.Element) || !isSendButton(target.closest("button") ?? target)) return;
    const snapshot = snapshotComposer(document);
    if (!snapshot || !snapshot.text.trim()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    onSubmitAttempt(snapshot, event);
  };
  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    const target = event.target;
    if (!(target instanceof document.defaultView!.HTMLElement) || !target.matches('[contenteditable="true"], textarea')) return;
    const snapshot = snapshotComposer(document);
    if (!snapshot || !snapshot.text.trim()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    onSubmitAttempt(snapshot, event);
  };
  document.addEventListener("click", handleClick, true);
  document.addEventListener("keydown", handleKeydown, true);
  return () => {
    document.removeEventListener("click", handleClick, true);
    document.removeEventListener("keydown", handleKeydown, true);
  };
}
