# Contributing to VOID

VOID is an early MIT-licensed product built with DESERT. We want the community
to benefit from the work and help improve it. Start with the
[roadmap](docs/ROADMAP.md), [Notes acceptance](docs/NOTES-VERTICAL.md) and the
current limitations in the README.

## Current access limitation

The SDK dependency is currently a private source checkout. Contributors without
access cannot yet reproduce the runtime proof. A public licensed SDK distribution
is required before we claim open, reproducible onboarding. VOID's license does
not grant rights to private SDK source or third-party assets.

Documentation review, reproducible issue descriptions and architectural feedback
are welcome while this dependency is being resolved. Never post credentials,
private notes, host logs with secrets or personal account data.

## Proposing changes

Describe the user-visible requirement and an observable acceptance case first.
Prefer a small vertical that can be tested over a second framework or a broad
rewrite. Distinguish defects from missing capabilities.

Use a branch and a pull request. `main` is the planned release boundary across
iOS, Android, Linux and Web, not a scratch branch. SDK fixes belong in DESERT;
product-specific workarounds for missing SDK behavior do not belong in VOID.

Each capability lives in `src/modules/<capability>/` and publishes an explicit
`*.module.ts` manifest. The root mounts manifests, not their internals. Catalogs
and the storyboard are derived by DESERT; never add a second hand-maintained
inventory. Product-level Home/collaborations live outside capability modules.

Views use `*.view.ts`; journeys use `*.journey.ts`. Product declarations must not
contain HTML, CSS, custom components, render callbacks or controller code. Closed
SDK catalogs own presentation. Runtime authority remains with the shared executor.
`npm run check` includes the SDK source boundary; build, host and inspection
also run it before evaluating declarations. Keep tests/infrastructure outside `src/`.

## Evidence and review

Include the exact commands run, their results, SDK revision and known gaps.
Write failing expectations before fixing behavior and preserve useful negative
cases. Do not mark a native target, MCP adapter or collaborative behavior covered
because TypeScript compiled or a local unit test passed.

Use English for source and maintained documentation. Discussion and feedback in
Spanish are welcome. Keep feedback specific and respectful; critique behavior
and design decisions, not people.

The README's local test commands apply only with the stated prerequisites.
The full release matrix is not available yet.
