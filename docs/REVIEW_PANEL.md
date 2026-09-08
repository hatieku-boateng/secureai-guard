# Review panel

`createReviewPanel(document, inspection, onAction)` renders an isolated DOM panel for a coordinator result. It uses `textContent` for findings and previews, so inspected text is not interpreted as HTML. The panel has dialog semantics, a labelled heading, an explanation, checkbox controls and four explicit actions.

The actions are deliberately notifications to the site adapter: redact selected, edit, cancel and send unchanged. The panel itself does not submit, edit the host composer, store content or make network requests. Redact selected calls the pure redaction layer and updates the protected preview. The original snapshot remains in the inspection result.

All findings start selected to make the protected preview conservative. Users can deselect individual findings before redaction. Sending unchanged remains a deliberate separate action and must be confirmed by the adapter policy later.

The panel is tested in JSDOM for accessible attributes, controls, selection behavior, action events and untrusted text rendering. Browser styling, focus trapping and integration with ChatGPT remain future checks.
