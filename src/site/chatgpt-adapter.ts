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
