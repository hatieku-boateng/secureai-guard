# ADR 0002: TypeScript checking and esbuild bundling

- Date: 2026-09-08
- Status: Accepted

## Decision

Use TypeScript for strict static checking and esbuild for browser JavaScript bundling. `npm run build` checks types first, then invokes a small JavaScript build script. Output is an immediately invoked function expression (IIFE), suitable for a future classic Chrome content script without runtime module imports.

Use ES2022 as the initial language target. Browser installation and compatibility will be verified with the manifest and indicator checkpoint. No frontend framework is needed.

## Consequences

esbuild does not perform TypeScript type checking, so the separate check is mandatory in the build command. Dependencies are local development tools, pinned through exact versions and package-lock.json. `npm ci` reproduces the locked installation. Generated dist files and node_modules are ignored by Git.

The current entry point is intentionally inert. Building it verifies the toolchain, not a functional Chrome extension. The manifest, Chrome permissions and actual page interaction come next.

`private: true` prevents accidental npm publication; it does not change public GitHub visibility. `UNLICENSED` records the existing deferred licence decision and grants no new licence.

## References

- https://esbuild.github.io/getting-started/
- https://www.typescriptlang.org/tsconfig/noEmit.html
