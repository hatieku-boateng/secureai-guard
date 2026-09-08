# Planned architecture

## Components

1. **ChatGPT site adapter:** locate the composer, read current text, intercept supported send actions, show review, and apply approved replacements. Keep selectors and page-specific behavior here.
2. **Inspection coordinator:** call enabled detectors, combine results and resolve duplicate/overlapping ranges deterministically.
3. **Rule detectors:** validated patterns for emails, phones and explicitly documented identifiers.
4. **Review panel:** accessible controls, selected findings, highlighted text and protected preview. Edit/cancel preserve the prompt; sending unchanged requires a deliberate action.
5. **Redaction engine:** replace approved ranges with meaningful placeholders, without mutating the original during preview.
6. **Local entity model (later):** lazy-loaded, evaluated name detector. Rules must work independently of model availability.
7. **File layer (later):** local extractors, with reconstruction kept separate from extraction.

## Proposed finding contract

```ts
type Finding = {
  id: string;
  category: "person" | "email" | "phone" | "identifier";
  start: number;
  end: number;
  text: string;
  confidence?: number;
  detector: "rule" | "model";
};
```

Ranges use JavaScript UTF-16 offsets: inclusive start, exclusive end. Findings belong to the exact inspected text snapshot. Before applying a result or permitting submission, check that the composer still matches that snapshot; changed text needs a new inspection. Finding values remain in memory only.

Overlap priority, repeated-value placeholder numbering and rule validation will be specified and tested in Milestone 2 before use in the review flow.

## Planned flow

```text
User attempts to send
  -> adapter snapshots text
  -> coordinator runs local detectors
  -> no findings: allow supported send action
  -> findings: pause and show review
       -> redact selected: return protected text to composer for user review
       -> edit/cancel: close review without sending
       -> send unchanged: allow deliberate send of the reviewed snapshot
```

Implementation must handle repeat clicks, keyboard submission, stale results and navigation without unintended sends. Browser verification is required; a passing detector unit test does not prove submission interception works.

## Technology direction

- Chrome Manifest V3, TypeScript, npm and plain HTML/CSS.
- Content scripts for the site adapter; no frontend framework initially.
- Vitest for meaningful detector and redaction tests.
- Choose an appropriate extension browser-testing tool during implementation.
- Evaluate Transformers.js and small compatible NER models in Milestone 4.
- Browser File API for TXT; evaluate DOCX/PDF libraries and OCR later.

The build toolchain now uses TypeScript for strict checks and esbuild for a browser IIFE bundle, as recorded in [ADR 0002](decisions/0002-typescript-esbuild-toolchain.md). The content-script entry point is inert. No model downloads or Chrome permissions have been introduced.
