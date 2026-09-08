# Privacy principles

These are implementation requirements, not claims about a completed product.

1. Inspect prompt and supported document content locally in the browser.
2. Never transmit original content to a project server or external detection API.
3. Keep inspection content in memory for the active review only. Clear references when the review ends; JavaScript cannot guarantee immediate physical memory erasure.
4. Do not retain prompts, extracted content or detected values in browser storage, logs, analytics or crash reports.
5. Request only permissions required by the current feature. Explain each permission and limit site access to supported sites.
6. Preserve user control: no silent replacements or automatic submission after redaction.
7. Treat webpage text and documents as untrusted. Render content as text, not executable HTML.
8. Show detection limitations and unsupported states clearly.
9. Use fictional or synthetic data for tests, screenshots and demos. Never commit real personal, medical, academic or confidential records.
10. Keep detection separate from document reconstruction. Never describe a visual PDF overlay as safe redaction if underlying content remains extractable.

Local inspection does not stop the host website from accessing content already entered into its page. This extension is intended to intercept supported submission actions, not provide isolation from the host site. The actual adapter coverage must be tested and documented before protection claims are made.

Model delivery, dependency packaging and any model caching require a documented decision before implementation. Model assets must be distinguished from sensitive user content.
