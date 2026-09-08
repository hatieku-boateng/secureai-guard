# Development log

## 2026-09-08 — Foundation from scratch

### Objective

Establish a documented, version-controlled foundation before writing extension code.

### Starting point

The current Windows project contained an empty Git repository on main, with no commits or remote. The earlier handover's scratch-directory files were unavailable. The project owner confirmed that this project is starting from scratch. GitHub authentication was verified for the intended owner, hatieku-boateng; the target repository was not found during the initial check.

### Changes

Created README.md, .gitignore, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, and documents for the overview, privacy requirements, architecture, roadmap, development log and first architecture decision.

The design keeps prompt inspection local, preserves user control and introduces features gradually. Redaction will return protected text to the composer for review. No extension code, dependencies, model downloads or licence have been added.

### Learning notes

- A Git repository records versions locally; a commit is a named snapshot of completed work.
- GitHub hosts a remote copy of that repository.
- A README introduces the project; the roadmap orders the work.
- An architecture decision record (ADR) explains an important technical choice and its tradeoffs.

### Verification

Documentation and local relative links are checked before the foundation commit. GitHub publication and remote verification will be recorded in the next entry once complete.

### Next checkpoint

After publication, pause to review the foundation. Begin Milestone 1 by explaining the extension's configuration files and content script before installing the toolchain.

## 2026-09-08 — GitHub foundation published

- Created the public repository https://github.com/hatieku-boateng/secureai-guard under the verified project-owner account.
- Connected origin and pushed main with foundation commit `4b3099c` (`docs: establish project foundation`).
- Verified all 11 local project files and their relative Markdown links; the staged whitespace check passed.
- Verified GitHub visibility is PUBLIC, its default branch is main, and the remote main commit matches the foundation commit. GitHub API listings confirmed the root and documentation folders.
- Marked publication complete in the roadmap. Licence selection remains deferred; no application code has been written.
- This entry and the roadmap update form a second documentation commit. Verify the final remote commit and complete file tree after pushing it.

Learning checkpoint: the documented project now has local version history and a public remote copy. Next is the minimal extension shell, beginning with an explanation of its configuration files.

## 2026-09-08 — Milestone 1: initialise the build toolchain

### Objective and explanation

Create the smallest reproducible TypeScript build before adding Chrome integration. Node.js runs development tools; npm installs them. package.json records commands and dependencies; tsconfig.json configures checking. esbuild converts and bundles source into browser JavaScript in dist.

### Changes

- Added package.json, package-lock.json, tsconfig.json, scripts/build.mjs and an inert src/content.ts entry point.
- Installed exact development dependencies: TypeScript 7.0.2 and esbuild 0.28.2.
- Added ADR 0002 documenting the toolchain and updated README, architecture, roadmap, contribution and security status.
- `private: true` prevents accidental npm publication; the GitHub repository remains public. `UNLICENSED` preserves the pending licence decision.

### Verification

- Existing environment: Node.js 25.0.0 and npm 11.6.2.
- npm install succeeded and reported zero known vulnerabilities at installation time.
- `npm run build` passed strict TypeScript checking and generated dist/content.js (29 bytes).
- `node --check dist/content.js` passed; inspection confirmed an empty IIFE with no page, network or storage behavior.
- Git ignore checks confirmed dist output and installed dependencies are excluded.

### Learning checkpoint

The development toolchain works, but this is not a loadable extension. Next: add manifest.json and a harmless visible indicator, document unpacked installation, and verify in Chrome. No detector, model or prompt interception has been added.

## 2026-09-08 — Milestone 1: minimal extension shell

### Objective and concepts

Add a Manifest V3 manifest and a harmless ChatGPT indicator. The manifest tells Chrome where and when to run the content script. A shadow root keeps the indicator's styles separate from the site's styles; it is not a security boundary against the host page.

### Changes

- Added root manifest.json with only https://chatgpt.com/* as its content-script match.
- Updated the build script to copy the manifest into dist alongside content.js.
- Implemented a compact bottom-left indicator with a named dismiss button and visible keyboard focus. It states “Checking not active”. Dismissal removes the indicator until reload without saving anything.
- Added docs/INSTALLATION.md and updated README, architecture, roadmap and security status.

### Verification and remaining check

- `npm run build` passed strict type checking and bundling.
- `node --check dist/content.js` passed.
- Parsed the built manifest and verified every referenced script exists in dist.
- Reviewed source: no prompt reads, send interception, storage or network calls; no extra extension API permissions.
- Chrome was absent from standard Program Files and per-user installation paths and no Chrome window was found. Brave was running. Browser choice was requested before proceeding with the visible loading check.
- Actual Chrome loading, appearance and keyboard dismissal remain unverified. Milestone 1 is not yet complete.

Next checkpoint: load the built dist folder in the chosen browser and verify the installation checklist. Record Brave results separately if used, and retain Chrome verification as pending until performed.

## 2026-09-08 — Chrome shell check confirmed

The user installed Chrome and confirmed loading the unpacked extension. A supplied screenshot showed one SecureAI Guard indicator with “Checking not active” on ChatGPT. The user then confirmed clicking the dismiss button hides it and reloading the page restores it.

The rebuild and JavaScript syntax check passed before the manual test. Computer Use could not reliably determine the browser URL, so browser evidence comes from the user's screenshot and explicit confirmations, not an automated browser test. Keyboard dismissal and absence on unrelated sites have not been tested and remain listed as follow-up checks.

Updated README, security status, architecture and roadmap to reflect the observed result. This completes the basic visible-shell checkpoint; sensitive-information detection is still inactive. Next learning step: define the Finding structure and implement an email detector with synthetic tests, before connecting detection to the page.

## 2026-09-08 — Milestone 2: first email detector

Objective: introduce a consistent finding format and a standalone local email rule before page integration. A finding records one occurrence and its exact position; a unit test compares the function's result against an expected result.

Added src/detection/types.ts, src/detection/email.ts, tests/email.test.ts and docs/EMAIL_DETECTION.md. Added Vitest 4.1.11 as an exact development dependency with a single-worker `npm test` command, following the handover's test-tool choice. Updated the lockfile, README, contributor guidance, architecture and roadmap.

The rule validates common ASCII email candidates, preserves offsets and returns distinct occurrences. Unsupported formats and ambiguity are documented. It does not claim mailbox validity or complete standards coverage. There is no content-script connection, persistence or network use in the detector.

Verification: all 30 synthetic tests passed, covering common formats, punctuation, malformed addresses, length boundaries, Unicode rejection, UTF-16 offsets, repeated occurrences and repeat calls. `npm run build` passed strict production type checking and bundling. npm installation reported zero known vulnerabilities at the time of installation. This fixture suite is not a precision/recall benchmark.

Learning checkpoint: the email rule is ready for further development but checking remains inactive on ChatGPT. Next: introduce Ghanaian phone-number detection with documented formats and synthetic tests. Coordinator overlap handling remains a separate step before UI integration.

## 2026-09-08 — Milestone 2: Ghana phone formats

Objective: add a second standalone detector using the shared Finding format. Checked the NCA published numbering plan and ITU Ghana listing before implementation; source links and supported scope are recorded in docs/GHANA_PHONE_DETECTION.md.

Created src/detection/ghana-phone.ts and tests/ghana-phone.test.ts. The rule checks broad domestic 02/03/05 families and their +233/00233 forms, including the explicit optional `(0)` presentation. It preserves formatting and offsets. It rejects wrong lengths and common embedded-identifier cases, but does not validate allocation, carrier or ownership. No additional dependency was needed.

Verification: 49 phone tests plus all 30 email tests passed (79 total). `npm run build` passed strict production type checking and bundling. Tests include synthetic mobile/fixed examples, punctuation, repeats, Unicode offsets, invalid prefixes/lengths and ambiguous adjacent numeric runs. The ambiguity and unsupported formats are documented; these tests are not an accuracy benchmark.

Updated README, architecture and roadmap. The browser indicator remains unchanged and checking remains inactive. Learning checkpoint: two independent detectors now share one result format. Next step: evaluate and implement support for other international phone formats, before selected identifiers and coordinator overlap handling.

## 2026-09-08 — Milestone 2: international phone formats

Objective: cover explicit international phone presentations without creating a hand-maintained rule for every country. Added exact `libphonenumber-js` 1.13.12 dependency and used its full local metadata and validation. Ghana formats remain delegated to the dedicated Ghana detector to prevent duplicate findings.

Created src/detection/international-phone.ts and tests/international-phone.test.ts. The rule accepts `+` and `00` prefixes, preserves text and offsets, rejects malformed or embedded candidates and does not claim assignment or ownership. One plausible UK test fixture was rejected by strict library validation and remains documented as a limitation.

Verification: 113 tests passed across three test files (30 email, 49 Ghana phone and 34 international phone). `npm run build` passed strict type checking and bundling. A standalone minified detector bundle measured 195,717 bytes (50,182 bytes gzip); the current content script does not import it, so the extension bundle has not grown. npm installation reported zero known vulnerabilities at the time of installation.

Updated README, architecture and roadmap. The browser indicator remains unchanged and detection remains inactive. Before importing this rule into the extension, measure the combined bundle and decide whether full metadata is acceptable or should be lazy-loaded/reduced.

## 2026-09-08 — Milestone 2: Ghana Card PIN shape

Objective: add one carefully scoped Ghanaian identifier rule. The NIA FAQ and portal documentation describe the Ghana Card PIN shape as `GHA-` followed by nine digits, a hyphen and one final digit. Created src/detection/ghana-card.ts, tests/ghana-card.test.ts and docs/GHANA_CARD_DETECTION.md.

The rule is local and format-only. It does not perform checksum, registry, identity or citizenship validation. It rejects malformed separators and embedded identifier/email text and preserves exact offsets.

Verification: all 130 tests passed across four files. The Ghana Card suite covers valid case variants, malformed lengths, separators, boundaries, repeats and UTF-16 offsets; the existing email, Ghana phone and international phone suites remain green. `npm run build` passed strict type checking and bundling. The rule is not imported by the content script, so browser behavior is unchanged.

Learning checkpoint: the first selected identifier rule is documented and tested, but it only recognizes a shape. Next: create the inspection coordinator to run the detectors together and resolve duplicate or overlapping findings before any ChatGPT submission interception.
