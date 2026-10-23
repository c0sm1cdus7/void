# VOID

VOID is an MIT-licensed product built with the DESERT SDK. Its goal is to let
people and authorized agents use the same typed activities, with reusable views
and consistent behavior across surfaces.

This repository starts from zero. It does not contain a fork of DESERT, an AI
provider, a private renderer or a completed operating system.

## Current milestone

For the current source checkpoint, start with the
[2026-10-23 external enforcement handoff](docs/HANDOFF-VISUAL-ENFORCEMENT-2026-10-23.md).
Visual ownership is not qualified. Historical milestone/test totals below do not
certify this newer checkpoint; the paired private DESERT repository is required.

The current development branch includes:

- Private Notes with creation, reading, editing, reviewed Trash and Restore, plus an optional durable Guided note experience.
- Personal Tasks with creation, editing, completion/reopening and typed multiple Project labels.
- System status based on controller evidence, shared device Appearance, and Identity access.
- The preserved Media gallery with image, video and audio playback.
- Private local image import with original preservation, optimized renditions, title editing, reviewed Trash and Restore.
- Real isolated PostgreSQL persistence through DESERT's admitted lifecycle.
- Empty-title preservation, private access, canonical validation and read projections.
- Idempotent acceptance, durable receipts and controller/database restart checks.
- Canonical execution shared by local human and agent sessions; image acquisition is browser-only.

The workspace mounts Home and the capability destinations through DESERT's
typed View program. Home and Notes invoke the same create journey; the shared
right-hand panel becomes transient when it cannot fit. Notes use the durable
runtime above, not browser-only storage. Catalog specimens stay isolated.

The repaired renderer mounts the approved v127a workspace and interactive bank
directly. The earlier parallel workspace preview was rejected; preservation
checks and their exact scope are recorded in [verification](docs/VERIFICATION.md).

The owner-approved recovery checkpoint is [`n1-stable`](releases/n1-stable.json),
paired with DESERT `v128a-stable`. It preserves the local web baseline on a
development branch; it is not a complete production/native release.

The current verified local checkpoint is `void-capabilities-20261022-n` on port
4400. It uses a new protected development installation for the evolved contract;
the earlier stable store is preserved rather than silently upgraded. First access
asks the owner to create the administrator identity and a password of at least
twelve characters. No default credentials exist. Exact build identity and the
1441/1441 SDK and 54/54 VOID browser results are recorded in
[verification](docs/VERIFICATION.md).

The normal local host is protected by first-admin initialization and password
sign-in, not an automatically issued developer identity. It remains a loopback
development deployment, not a production security qualification. DESERT also has
a real stdio MCP adapter for canonical operations. Remote enrollment, collaborative
Notes, real provider execution, identity recovery/OAuth and native binaries remain
unfinished. See [overnight decisions and verification](docs/OVERNIGHT-2026-10-22.md).

## Repository structure

```text
src/void.product.ts       Single product composition
src/navigation.ts         Destination selection and order
src/exposures.ts           Human and agent exposure
src/modules/notes/        Note, commands, journeys and views together
src/modules/tasks/        Task, typed Project labels, commands, journeys and views
src/modules/system/       Live controller evidence and contract inventory
src/modules/appearance/   Shared device preferences
src/modules/identity/     Current identity and session lock
src/modules/media/        Sample albums/playback and private image lifecycle
src/modules/visualCatalog/ Shared visual catalog destination
src/views/                Product-level views such as Home
src/journeys/             Product-level activities and collaborations
scripts/                  Checked SDK build, host and inspection entrypoints
tests/                    Independent contract and real-runtime checks
docs/                     Roadmap, acceptance and release requirements
```

Start at [`src/void.product.ts`](src/void.product.ts): modules and Home are
composed as data. Each `*.view.ts` is a `View` object.
DESERT binds canonical forms/collections, renders its shared components and
executes admitted operations. VOID supplies no HTML, CSS or private renderer.
`src/modules/visualCatalog/views/visualCatalog.view.ts` mounts DESERT's existing
interactive web catalog. The SDK derives the definition catalog, storyboard
and View program from registered modules; there is no parallel manual inventory.
Public hosts and builders call `compile(VoidProduct)` and derive that composition's
admitted View program. They cannot accept another program override or fall back
to a standalone product renderer. Derived `VOID` wire data is for inspection and
internal protocol tests, not a second product entrypoint.
See the [code anatomy and reading order](docs/ANATOMY.md).
The [architecture contract](docs/MODULE-ANATOMY.md) distinguishes installed
module/source boundaries from remaining runtime and roadmap capabilities.

Run `npm run inspect` to inspect the derived catalog and storyboard. Build,
host and inspection entrypoints validate every product declaration before
importing it; the source gate is also part of `npm run check`.

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

The current Media demonstration additionally needs the existing local Apple
Landmarks reference checkout expected by the SDK. Its photographs are not
redistributed in VOID, and missing assets fail rather than hiding Media.

```sh
npm run web:build -- build/void-web
npm run dev -- build/void-web
```

Build destinations must be fresh. The host prints its loopback address and the
path to a private `web-launch.json`; open that file's one-use URL locally.
Initialize the administrator in the browser, then use that identity's password
to unlock. The host creates no default account. Identity records, notes and tasks
remain in the selected private data directory across restarts; no plaintext
password is stored. Do not share the launch URL. Recovery is not implemented.
Existing stores reject changed contract/installation revisions. Do not delete or
repin them: select a fresh directory explicitly, for example
`npm run dev -- build/void-web .local/void-current 4400`.

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

[Media](docs/MEDIA.md) restores the approved browsing anatomy: albums, cover
carousel and the shared viewer. Image zoom, video/audio playback, thumbnails,
seeking, volume and admitted captions use the same catalog. Authenticated private
image import and durable image lifecycle are implemented; private albums,
collection thumbnails and audio/video import remain requirements. Reference
photographs are not redistributed in this repository.

All work uses branches. `main` is reserved for the intended versioned
iOS/Android/Linux/Web release pipeline, which is not installed yet.
Read the [roadmap](docs/ROADMAP.md) and [release policy](docs/RELEASES.md).

## Participate

We want this work to be useful to the public and improved with the community.
Feedback, reproducible reports, documentation and focused contributions are
welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md); current gaps are explicit
so contributors can distinguish working code from intended capabilities.

[MIT license](LICENSE). This license covers VOID, not DESERT or third-party assets.
