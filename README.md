# SecureAI Guard

A planned privacy-focused Chrome extension that helps people detect and redact sensitive information before sending prompts to generative AI tools.

**Status: minimal extension shell loaded in Chrome; indicator appearance, click dismissal and reload verified. Sensitive-information checking is not active.**

The initial target is ChatGPT. Inspection will run locally in the browser, without sending prompt content to a detection service or retaining it in extension storage.

## Planned experience

When a user attempts to send a prompt, the extension checks it. If it finds potentially sensitive information, it pauses submission and presents a review panel. The user can select findings to redact, edit, cancel, or deliberately send unchanged. Redaction returns the protected text to the composer for review; the user remains responsible for sending it.

Fictional example:

```text
Original: Contact Ama Mensah at ama.mensah@example.com.
Protected: Contact [PERSON_1] at [EMAIL_1].
```

Personal-name detection is a later milestone and depends on model evaluation. No automated detector can guarantee that all sensitive information will be found.

## Scope

- Chrome Manifest V3, with ChatGPT as the first site.
- Typed and pasted text first; TXT attachments after prompt review works.
- Email addresses, Ghanaian and international phone formats, selected identifiers, and eventually likely personal names.
- TypeScript with plain HTML/CSS; local rule detection before any local entity model.
- Synthetic examples and evaluation data only.

DOCX, PDF and OCR support are future work. Extracting text from a document does not make the original document safely redacted.

## Project documents

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Privacy principles](docs/PRIVACY.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Development log](docs/DEVELOPMENT_LOG.md)
- [First architecture decision](docs/decisions/0001-browser-extension-local-processing.md)
- [Contribution guidance](CONTRIBUTING.md)
- [Security guidance](SECURITY.md)

## Development setup

Install Node.js with npm, then run these commands from the project folder:

```sh
npm ci
npm run build
```

`npm ci` installs the exact development dependencies in package-lock.json. `npm run build` checks TypeScript and bundles src/content.ts into dist/content.js. Run `npm run typecheck` for checking alone.

Run `npm test` for the synthetic detector tests. The [email detector](docs/EMAIL_DETECTION.md), [Ghana phone detector](docs/GHANA_PHONE_DETECTION.md), [international phone detector](docs/INTERNATIONAL_PHONE_DETECTION.md) and [Ghana Card detector](docs/GHANA_CARD_DETECTION.md) are implemented separately and are not yet active on ChatGPT; the visible extension remains an indicator only.

The [inspection coordinator](docs/INSPECTION_COORDINATOR.md) combines those rules into one local result. It is also not connected to the page yet.

The [institutional identifier detector](docs/INSTITUTIONAL_ID_DETECTION.md) uses explicit student/employee labels rather than guessing from arbitrary numbers.

The [redaction layer](docs/REDACTION.md) can preview selected replacements while preserving the original text. It is not connected to ChatGPT submission yet.

Verified locally with Node.js 25.0.0 and npm 11.6.2; this records the tested environment, not a requirement for that exact Node version. TypeScript and esbuild are pinned in package.json and the lockfile.

The build copies manifest.json and bundles the content script into dist. Follow the [unpacked installation guide](docs/INSTALLATION.md) to load that folder into Chrome. The script displays a dismissible “SecureAI Guard — Checking not active” indicator on ChatGPT only. Do not edit dist directly: build it from src. Neither dist nor node_modules is committed.

## Licence

No licence has been selected. Normal copyright restrictions apply. We will discuss and document the licence decision before accepting outside contributions.
