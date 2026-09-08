# Roadmap

Work in small learning checkpoints. Explain the purpose and affected files before implementation; verify, update the development log and commit each completed step.

## Milestone 0 — Foundation

- [x] Define problem, users and MVP.
- [x] Document privacy principles, architecture and roadmap.
- [ ] Publish and verify the foundation on GitHub.
- [ ] Discuss and record a licence decision before outside contributions.

Licence selection is deliberately deferred and does not block local extension development.

## Milestone 1 — Minimal extension shell

- Teach package.json, manifest.json, TypeScript configuration, content scripts and build output.
- Initialise npm and TypeScript, choose and document the minimal build toolchain.
- Create a Manifest V3 manifest and ChatGPT content script.
- Display a harmless SecureAI Guard indicator, clearly stating that checking is not active.
- Document unpacked installation and verify loading in Chrome.

## Milestone 2 — Structured detection

- Implement the Finding contract and deterministic overlap handling.
- Add email, Ghanaian phone, international phone and selected identifier rules incrementally.
- Document supported formats and validation limits.
- Build synthetic cases and tests for valid/invalid values, punctuation, boundaries, overlaps and false positives.

## Milestone 3 — Review and redaction

- Intercept and verify supported submission actions.
- Add accessible review, selection, preview and meaningful placeholders.
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
