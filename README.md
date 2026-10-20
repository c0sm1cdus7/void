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

The local **N1** increment mounts Home, Notes and Visual catalog through DESERT's
typed View program. Home and Notes invoke the same create journey; the shared
right-hand panel becomes transient when it cannot fit. Notes use the durable
runtime above, not browser-only storage. Catalog specimens stay isolated.

The repaired renderer mounts the approved v127a workspace and interactive bank
directly. The earlier parallel workspace preview was rejected; preservation
checks and their exact scope are recorded in [verification](docs/VERIFICATION.md).

The owner-approved recovery checkpoint is [`n1-stable`](releases/n1-stable.json),
paired with DESERT `v128a-stable`. It preserves the local web baseline on a
development branch; it is not a complete production/native release.

This is a trusted local developer workspace, not production onboarding/login.
Safe editing, real MCP, a remote API, collaboration and native binaries remain
unimplemented. See [Notes acceptance and SDK gaps](docs/NOTES-VERTICAL.md).

## Repository structure

```text
objects/       Domain facts and policy references
commands/      Declarative changes interpreted by DESERT
journeys/      Activities named *.journey.ts
views/         Typed *.view.ts declarations and validated registry
tests/         Independent contract and real-runtime checks
docs/          Roadmap, acceptance and release requirements
```

Start at [`experience.ts`](experience.ts): destinations, navigation, Views and
journey bindings are composed as data. Each `*.view.ts` is a `View` object.
DESERT binds canonical forms/collections, renders its shared components and
executes admitted operations. VOID supplies no HTML, CSS or private renderer.
`views/visualCatalog.view.ts` mounts DESERT's existing interactive web catalog.
See the [code anatomy and reading order](docs/ANATOMY.md).
The [target architecture](docs/MODULE-ANATOMY.md) consolidates capability modules,
typed navigation and ownership rules; it is not an installed module API or a
completed source reorganization.

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

To build and run the local web workspace:

```sh
npm run web:build -- build/void-web
npm run dev -- build/void-web
```

Build destinations must be fresh. The host prints its loopback address and the
path to a private `web-launch.json`; open that file's one-use URL locally.
Credentials and notes remain in `.local/void` across restarts. Do not share the
launch URL or identity file. Existing stores with missing/invalid credentials
fail closed rather than silently replacing the identity.

Browser acceptance uses an isolated store, never your workspace:

```sh
VOID_WEB_BUILD="$PWD/build/void-web" npm run test:web
```

The tested SDK revision and exact scope are recorded in
[verification](docs/VERIFICATION.md).

## Direction

The delivery order is **Notes → System → Appearance → Identity → Connections →
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
