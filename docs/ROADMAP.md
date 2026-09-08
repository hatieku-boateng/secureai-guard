# Roadmap

Work in small learning checkpoints. Explain the purpose and affected files before implementation; verify, update the development log and commit each completed step.

## Milestone 0 — Foundation

- [x] Define problem, users and MVP.
- [x] Document privacy principles, architecture and roadmap.
- [x] Publish and verify the foundation on GitHub.
- [ ] Discuss and record a licence decision before outside contributions.

Licence selection is deliberately deferred and does not block local extension development.

## Milestone 1 — Minimal extension shell

- [x] Teach package.json, manifest.json, TypeScript configuration, content scripts and build output.
- [x] Initialise npm and TypeScript, choose and document the minimal build toolchain.
- [x] Create a Manifest V3 manifest and ChatGPT content script.
- [x] Implement a harmless SecureAI Guard indicator, clearly stating that checking is not active.
- [x] Document unpacked installation.
- [x] Verify Chrome loading, indicator appearance, click dismissal and return after reload.
- [ ] Follow-up shell checks: keyboard dismissal and absence on unrelated sites.

## Milestone 2 — Structured detection

- [x] Define the Finding contract and implement email detection with synthetic tests.
- [ ] Add the inspection coordinator and deterministic overlap handling.
- [x] Add Ghanaian mobile/fixed-line format detection, including +233/00233 forms, with synthetic tests.
- [x] Add explicit international phone-format detection with maintained local metadata and synthetic tests.
- [x] Add Ghana Card PIN shape detection with synthetic tests.
- [x] Add the inspection coordinator and deterministic overlap handling.
- [x] Add a conservative labelled student/employee identifier rule with synthetic tests.
- [ ] Add further institution-specific rules only with documented synthetic evaluation data.
- Document supported formats and validation limits.
- Build synthetic cases and tests for valid/invalid values, punctuation, boundaries, overlaps and false positives.

## Milestone 3 — Review and redaction

- [x] Add pure selected-redaction preview with stale-range and overlap checks.
- [x] Add an accessible review panel in isolation with selection and explicit actions.
- [x] Add a read-only ChatGPT composer snapshot adapter.
- [x] Add isolated interception logic for labelled send buttons and Enter submission.
- [x] Connect local inspection and the review panel to supported send attempts.
- [ ] Verify clean prompts, paused findings and redaction in Chrome.
- [ ] Complete deliberate “Send unchanged” replay behavior.
- [ ] Integrate the review panel with the ChatGPT site adapter.
- Preserve content on edit/cancel, prevent stale approvals, and support deliberate send unchanged.
- Verify complete browser flows, including repeated send attempts and changed prompts.

## Milestone 4 — Local name detection

- Research and benchmark browser-compatible NER candidates.
- Measure size, loading time, inference, memory, Ghanaian-name recall and false positives.
- Document a selection decision before integration; lazy-load the selected model.

## Milestone 5 — TXT checking

- Add local protected file selection, extraction, shared inspection and review.
- Create a protected copy and verify its contents before attachment.
- Verify that the original is not uploaded by the protected flow.

## Milestone 6 — Evaluation and demonstration

- Measure precision, recall and false positives by category on synthetic data.
- Conduct a small usability evaluation and complete the threat model.
- Document limitations, package the extension and prepare synthetic demonstrations and a pitch.

## Future scope

Evaluate DOCX, text PDFs, then scanned PDFs/images. Each format requires its own reconstruction and redaction safety checks.
