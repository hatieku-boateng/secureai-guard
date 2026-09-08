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

## 2026-09-08 — Milestone 2: inspection coordinator

Objective: combine the four current local detectors into one consistent result before browser integration. Added src/detection/coordinator.ts, tests/coordinator.test.ts and docs/INSPECTION_COORDINATOR.md.

`inspectText` preserves the exact text snapshot and runs email, Ghana phone, international phone and Ghana Card detection. `resolveFindings` removes duplicates and uses documented deterministic priority: identifier, email, phone, person; then longer range and stable ID. It returns findings in text order without mutating caller data.

Verification: all 134 tests passed across five files. `npm run build` passed strict TypeScript checking and bundling. The coordinator is not imported by the content script, so the browser indicator and site behavior remain unchanged.

Learning checkpoint: detector output is now unified and overlap behavior is explicit. Next: select and document additional institutional identifier formats, then build a review/redaction layer before intercepting ChatGPT submission.

## 2026-09-08 — Milestone 3: pure selected redaction

Objective: build the safe text transformation underneath the review panel before touching ChatGPT submission. Added src/detection/redaction.ts, tests/redaction.test.ts and docs/REDACTION.md.

`redactSelected` preserves the original, verifies each finding still matches the inspected snapshot, rejects invalid/overlapping ranges and creates meaningful per-category placeholders in text order. It performs no storage, network, page access or submission.

Verification: all 156 tests passed across seven files and `npm run build` passed strict type checking and bundling. The coordinator result is now suitable for a future review panel, but the content script remains indicator-only.

Learning checkpoint: the core preview transformation is complete. Next: design and implement the accessible review panel in isolation, then verify it before connecting submission interception.

## 2026-09-08 — Milestone 3: review panel in isolation

Objective: give users a clear decision surface without connecting it to a live submission action. Added src/review/panel.ts, tests/review-panel.test.ts, exact jsdom test dependency and docs/REVIEW_PANEL.md.

The panel uses dialog semantics, text-only rendering for untrusted findings, selected checkboxes, protected preview and explicit Redact selected, Edit, Cancel and Send unchanged actions. It emits action objects to a future site adapter; it does not submit, edit the host page, store content or use the network.

Verification: all 160 tests passed across eight files and `npm run build` passed strict type checking and bundling. JSDOM tests took longer because of its import cost, but completed successfully. Browser focus behavior and ChatGPT integration remain unverified.

Learning checkpoint: review decisions and redaction preview now have a tested UI boundary. Next: implement a ChatGPT adapter that snapshots the composer and pauses supported send actions, with browser verification after each small change.

## 2026-09-08 — Milestone 3: isolated submit interception

Objective: add a removable adapter listener for supported click and keyboard submissions without connecting detection or UI. `installSubmitInterception` captures labelled send buttons and Enter without Shift in the composer, prevents the event and passes the current snapshot to a callback. Empty prompts, Shift+Enter and unrelated buttons are left unchanged.

Verification: adapter tests now cover click interception, Enter/Shift+Enter behavior, empty prompts and cleanup; the full suite and build will be recorded after the combined run. The listener is not enabled by the content script yet. Chrome verification of the live send controls is required before enabling it.

## 2026-09-08 — Milestone 3: read-only ChatGPT composer adapter

Objective: begin live integration without changing the page or intercepting submission. Added src/site/chatgpt-adapter.ts, tests/chatgpt-adapter.test.ts and docs/CHATGPT_ADAPTER.md.

The adapter isolates selectors for ChatGPT's Lexical editor, placeholder textarea and contenteditable fallbacks. It returns an exact element/text snapshot and explicitly excludes the SecureAI indicator. No listeners, event prevention, page mutation, storage or network access were added.

Verification: adapter tests cover preferred and fallback markup, exact text snapshots, missing composers and indicator exclusion. Full test and build results will be recorded after the combined run. Live Chrome selector verification remains the next browser checkpoint.

## 2026-09-08 — Milestone 2: labelled institutional identifiers

Objective: cover student and employee identifiers without pretending that one Ghana-wide format exists. Added src/detection/institutional-id.ts, tests/institutional-id.test.ts and docs/INSTITUTIONAL_ID_DETECTION.md.

The detector requires an explicit label such as Student ID, learner number, Employee ID or staff identification, then flags a 4–20 character alphanumeric/slash/hyphen value. It returns only the value range. This reduces arbitrary-number false positives but misses unlabelled and unsupported local formats; no real institutional data is used.

Verification: standalone tests cover labelled synthetic student and employee values, case, punctuation, unsupported/short values, repeats and UTF-16 offsets. All 151 tests passed across six files, and `npm run build` passed strict type checking and bundling. The coordinator now includes this rule; the content script remains indicator-only. Next: begin the review/redaction design before connecting anything to ChatGPT submission.

## 2026-09-08 — Milestone 3: isolated submit interception

Added a removable listener to the ChatGPT adapter for labelled send buttons and Enter without Shift in the composer. It prevents the event and passes a fresh snapshot to a callback; empty prompts, Shift+Enter and unrelated buttons remain untouched. The content script does not enable it yet.

Verification: all 168 tests passed across nine files and `npm run build` passed strict type checking and bundling. Chrome verification of the live send controls is required before enabling this listener.

## 2026-09-08 — Milestone 3: connect local review flow

The content script now enables the adapter, runs the local inspection coordinator and mounts the review panel when findings exist. Clean prompts are allowed through. Findings pause the supported send event. Redact selected writes the protected preview back to the captured composer and closes the panel; edit and cancel close it without submission. The panel is rendered in a shadow root with text-only content handling.

`Send unchanged` remains intentionally incomplete until replay can be verified safely against the live ChatGPT control. No automatic submission was added.

Verification: all 168 tests passed across nine files and `npm run build` passed. The bundled content script grew to 268.6 KB (about 275,002 bytes) because the international phone detector's full metadata is now included. This is a material tradeoff to revisit with lazy loading or reduced metadata before release. No prompt is stored or sent externally.

Next checkpoint: reload the unpacked extension in Chrome and verify a clean prompt, a finding pause, selective redaction and cancel behavior using synthetic content only.

## 2026-09-08 — Milestone 3: deliberate unchanged replay

Added a one-shot bypass to the adapter controller. The review panel's Send unchanged action removes the panel, records the exact snapshot, and clicks the live send button once. The interception layer allows only the same element with the same text through; it clears the bypass immediately, and a changed snapshot is paused again.

Verification: all 170 tests passed across nine files and `npm run build` passed. The bundled content script is 269.4 KB because the local international-phone metadata is included. The screenshot supplied by the user confirms the review panel and two findings appeared in Chrome; the new unchanged-replay code still needs a live Chrome test.

## 2026-09-08 — Milestone 3: stale composer protection

Added `isCurrentSnapshot` to ensure a reviewed composer element is still connected and unchanged before applying a protected preview. If the user edits the prompt while the review panel is open, the redaction action no longer overwrites that newer text. The existing one-shot unchanged replay already uses the same snapshot requirement.

Verification: all 171 tests passed across nine files and `npm run build` passed. Live Chrome verification of unchanged replay, redaction and stale-edit behavior remains required.

## 2026-09-08 — Milestone 3: session protection switch

Added a `Turn on protection` / `Turn off protection` control to the SecureAI Guard composer indicator. Protection starts disabled for each page session, uses an accessible `aria-pressed` state, and resets on reload. When disabled, the adapter leaves sends alone and does not run local inspection. The state is memory-only.

Verification: all 172 tests passed across nine files and `npm run build` passed. The content bundle is 270.6 KB. Chrome verification of the control and enabled flow remains required.

## 2026-09-08 — Composer-associated session control

Moved the SecureAI Guard indicator from the page bottom-left to a centered position directly above the ChatGPT composer area. The turn-on/off control remains session-scoped, keyboard-accessible and isolated in a shadow-root host; ChatGPT's composer DOM is not modified.

The user screenshot confirmed the prior toggle rendered successfully. The new position requires a fresh Chrome reload check, including narrow-window and responsive layout behavior.

## 2026-09-08 — Manual number report regression check

The user reported that `0249663991` was sent without a review panel. The detector recognizes this exact domestic Ghana phone shape; a regression test now covers it. The supplied screenshot shows the message already in the conversation and the protection indicator currently on, so it does not establish whether protection was enabled before that send. A fresh test must reload the extension, turn protection on first, then enter and submit the number. If it still sends, inspect the live send-button selector/event path.
