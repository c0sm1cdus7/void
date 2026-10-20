# VOID

VOID is an MIT-licensed product built with the DESERT SDK. Its goal is to let
people and authorized agents use the same typed activities, with reusable views
and consistent behavior across surfaces.

This repository starts from zero. It does not contain a fork of DESERT, an AI
provider, a private renderer or a completed operating system.

## Current milestone

**Notes N0** is an executable create/read runtime proof:

- Declarative Note object, ownership policy and create/read journeys.
- Real isolated PostgreSQL persistence through DESERT's admitted lifecycle.
- Empty-title preservation, private access, canonical validation and read projections.
- Idempotent acceptance, durable receipts and controller/database restart checks.
- The same journey exposure through local human and agent sessions.

There is no VOID UI, migrated Visual catalog, safe note editing, real MCP server,
remote API, collaborative editor or native binary yet. Local agent exposure is
not MCP integration. See [Notes acceptance and SDK gaps](docs/NOTES-VERTICAL.md).

## Repository structure

```text
objects/       Domain facts and policy references
commands/      Declarative changes interpreted by DESERT
journeys/      Activities named *.journey.ts
views/         Reserved for reusable *.view.ts declarations
tests/         Independent contract and real-runtime checks
docs/          Roadmap, acceptance and release requirements
```

The shared view-definition API is not installed in DESERT yet. The requested
`views/visualCatalog.view.ts` is a tracked next step, not a fake constructor or
handwritten page. The web Visual catalog will consume the same registered
primitives as the product.

## Local verification

**Public onboarding is currently blocked by the private SDK dependency.**
The local dependency is `desert-sdk: file:../desert`, not a published package.
You need an authorized DESERT checkout beside this repository, its dependencies
installed, Node 24 and PostgreSQL tools on PATH. Do not copy private SDK source
into VOID. The SDK needs its own reviewed public distribution and license before
everyone can reproduce these checks.

With those prerequisites:

```sh
nvm use
npm ci --ignore-scripts
npm run check
```

Without nvm, select Node 24 by your normal environment manager. The tests create
and remove their own temporary PostgreSQL clusters using Unix sockets. They do
not connect to an existing database or require provider credentials.
The current host proof is macOS; other platforms remain unqualified.

The tested SDK revision and exact scope are recorded in
[verification](docs/VERIFICATION.md).

## Direction

The delivery order is **Notes → System → Appearance → User → Connections →
Environments → Tasks**. VOID CLI will bridge available providers in enrolled
environments, queue work and enforce a limit per environment-bound actor.
These are roadmap requirements, not features implied by the N0 tests.

[Media](docs/MEDIA.md) will carry forward Landmarks' browsing anatomy with
albums and one viewer for images, video and music. It is a recorded design
requirement, not implemented playback or a public redistribution of sample assets.

All work uses branches. `main` is reserved for the intended versioned
iOS/Android/Linux/Web release pipeline, which is not installed yet.
Read the [roadmap](docs/ROADMAP.md) and [release policy](docs/RELEASES.md).

## Participate

We want this work to be useful to the public and improved with the community.
Feedback, reproducible reports, documentation and focused contributions are
welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md); current gaps are explicit
so contributors can distinguish working code from intended capabilities.

[MIT license](LICENSE). This license covers VOID, not DESERT or third-party assets.
