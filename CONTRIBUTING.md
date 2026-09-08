# Contributing

This project is in its initial toolchain stage. A licence decision is pending; outside contributions are not being accepted until that decision is discussed and recorded.

For development sessions:

1. Explain the objective, new concepts and files to change.
2. Make one focused change within the current milestone.
3. Verify behavior with appropriate tests or inspection.
4. Update docs/DEVELOPMENT_LOG.md and any affected architecture/roadmap documents.
5. Record major technical decisions under docs/decisions/.
6. Commit the completed step with a concise message.
7. Pause at a learning checkpoint before a substantially new concept.

Use synthetic data only. Never commit credentials, real prompts or private documents. Do not log detected sensitive values. Keep dependencies and extension permissions minimal.

Use `npm ci` to install locked dependencies, `npm test` to run synthetic detector tests, `npm run typecheck` to check production TypeScript and `npm run build` to check and bundle. Browser checks are documented in docs/INSTALLATION.md; unit tests alone do not prove browser integration works.
