# Project overview

## Problem

People can unintentionally submit personal or confidential information to generative AI tools. A separate checking website adds copying and switching steps, which makes consistent review harder.

SecureAI Guard aims to bring that review into the AI website, before submission, while keeping the inspection local and the user in control.

## Intended context and users

The project owner's brief identifies SecureAI Hackathon 2026, CAIRLab at KNUST in partnership with IBM, as the intended submission context. Event details and eligibility have not yet been independently verified.

Initial users include lecturers, students, researchers, healthcare workers, public-sector staff, businesses and individuals. Evaluation will consider Ghanaian names, phone formats, selected institutional identifiers and local contexts, using fictional data only.

## MVP

Build a Chrome Manifest V3 extension for ChatGPT prompt text. Detect emails, telephone numbers and carefully scoped identifiers using local rules. Add likely personal-name detection only after evaluating browser-compatible local models.

When findings exist, pause sending and offer an accessible review interface with selected redaction, protected-text preview, editing, cancellation and deliberate sending unchanged. Preserve the original until the user decides. Do not silently submit edited content.

## Boundaries

- The extension is an advisory prototype, with false positives and missed findings.
- It cannot promise anonymity, regulatory compliance, or detection of all confidential information.
- ChatGPT page changes may break integration; unsupported states must be visible.
- Attachments are outside the initial prompt-only protection scope.
- No external detection API, prompt telemetry or prompt storage.
- TXT support follows the working prompt flow. DOCX, text PDFs and OCR follow separate evaluation.

## Evidence of progress

Use synthetic tests, browser flow verification and measured precision/recall by category. Later model evaluation must record download size, loading and inference times, memory use, Ghanaian-name recall and false positives on the actual test device.
