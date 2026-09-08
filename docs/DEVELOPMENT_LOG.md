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
