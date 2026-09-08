# ChatGPT composer adapter

The first adapter step is deliberately read-only. `snapshotComposer(document)` finds a supported composer and returns its element plus the exact current text. It does not attach listeners, prevent events, alter the composer or submit anything.

Selectors are isolated in `src/site/chatgpt-adapter.ts` so ChatGPT page changes do not affect detector or redaction code. The preferred selector targets ChatGPT's Lexical editor, followed by the placeholder textarea and generic contenteditable fallbacks. The adapter must be tested against the live page before relying on any selector.

The snapshot is a point-in-time value. Before applying a later review decision, the adapter must confirm that the same element still exists and its text still equals the snapshot. A changed or replaced composer requires a new inspection.

`installSubmitInterception` now recognizes labelled send buttons and Enter without Shift in the composer. It prevents those events and gives the caller a fresh snapshot; Shift+Enter, empty prompts and unrelated buttons are left alone. The listener is removable for cleanup. It does not inspect, redact, show a panel or submit an alternative action yet. Browser verification must confirm the selectors against the live page before enabling it in the content script.

The content script now enables this listener and runs the local coordinator. Clean prompts return `false` and continue normally. Findings pause the send and mount the review panel in a shadow root. Redact selected writes the protected preview into the composer for review; edit and cancel close the panel. Send unchanged is intentionally left for the next checkpoint because its replay must be verified against the live ChatGPT control.

The controller now supports a one-shot matching bypass for Send unchanged. It requires the same composer element and unchanged snapshot, then clicks the live send button once. A changed snapshot is intercepted again, and the bypass is cleared after one attempt.

`isCurrentSnapshot` checks that the captured element is still connected and its text is unchanged. The content script uses this check before writing a protected preview, so edits made while the panel is open cannot be overwritten by an older review result.

Protection is session-scoped and starts disabled. The indicator includes a keyboard-accessible `Turn on protection` / `Turn off protection` button with `aria-pressed`; changing it only changes in-memory state and reload resets it. When off, the adapter leaves sends alone and does not run inspection.

The indicator is positioned directly above the ChatGPT composer area, centered in the viewport, so the session control is visually associated with composing a prompt. It remains in a separate shadow-root host to avoid changing ChatGPT's own composer DOM. Responsive positioning and narrow-window checks remain part of browser verification.

The adapter accepts nested elements inside a contenteditable composer and labelled `button` or `role="button"` send controls. This covers ChatGPT layouts where Enter originates from a paragraph inside the editor or the send arrow is not a native button.
