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
