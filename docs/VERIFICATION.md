# VOID verification

## Protected composed workspace — 2026-10-22, checkpoint N

Current live artifact: `build/void-capabilities-20261022-n`, served at
`http://127.0.0.1:4400/`. This supersedes the live-host statements below, not the
owner-approved stable release. Both existing VOID browser tabs were reloaded
and visibly verified at first-administrator initialization. No administrator,
password or default development identity was created in this installation.

Build manifest format: `desert.distribution-build/3`.

- Contract: `f3a0b0651119568b2a235a08c05ccd198d512bdb044f814fb26167e3eab4fb9f`.
- Surface: `6ef0c34e00f2008312a6133aeb5c08922a92cd80c70501a4cdb55cdeecf7be78`.
- View program: `467bbe6963ede672a9571ec140f4e0682eb4dae81005a44e46f585111004d7c2`.
- Activities: `c90b54c6afb8818ddc8ec8a68a7fbcaada4ab844e004e2cf04dc630ed8161f15`.
- Renderer: `08b29eb958ae2c2dbfd69e7b1dc98b69031c1dc7412dce029f3728cb26f858e8`.

Executed on Node 24.16.0, with production sources frozen for the N builds and
qualification runs:

| Check | Result | Evidence log |
| --- | --- | --- |
| Complete SDK suite | **1441/1441**, 980.2 seconds | `desert/.local/full-sdk-overnight-n-confirmed.log` |
| VOID contract/runtime, source admission and TypeScript | **40/40**, **85 admitted files**, TypeScript pass | `void/.local/check-n.log` |
| Generated VOID browser | **54/54**, 284.4 seconds | `void/.local/browser-n.log` |
| Generated Notebook continuity | **16/16** | `desert/.local/notebook-continuity-browser-n.log` |
| Generated Inspection catalog | **40/40** | `desert/.local/inspection-N.log` |
| Generated public catalog and motion | **31/31** | `desert/.local/public-visual-N.log` |
| Shared press, reading and accessibility cases | **19/19** | `desert/.local/press-browser-n.log` |
| Shared visual owners and extraction comparisons | **27/27** | `desert/.local/shared-owners-N-settled.log` |

All listed suites completed with zero failures, skips, cancellations or todos.
After the final documentation update, generated authoring references were rebuilt
and checked against source; the authoring-package suite passed **5/5**. All 340
local links checked across the SDK/VOID anatomy, status and delivery documents
resolve, and both repositories pass `git diff --check`.
The built browser evidence includes Notes/Tasks lifecycle at compact and desktop
widths, Guided note reload/Back/review, private image import and revocation,
controller outage/recovery, search and toolbar scrolling, shared material and
two real browser tabs changing identity while an earlier preparation is pending.
The host rejects a request whose browser binding no longer matches its cookie
session; late responses cannot revive the retired instance or repaint private data.

The preceding full run passed 1439/1441: an old image-initialization fixture
implicitly requested a now-forbidden unbound transport, and a toolbar fixture
loaded CSS after mounted components, reversing the real build's cascade-layer
order. The fixtures now explicitly select developer transport or load the same
CSS before mounting. Their validation and alignment assertions are unchanged;
both pass in the complete confirmation run above. A separate relocation fixture
now waits for finite animations before comparing computed styles. No screenshot
baseline was reset and no tolerance was widened. These test-only changes do not
retroactively qualify failed runs or change the N production artifact.

Source/API closure, exact structural/computed-style comparisons and bounded
page/search/toolbar/viewer pixel tests pass. Independent-page Button raster output
was not certified bit-identical because even its unchanged control has rendering
noise. The global legacy visual ownership graph remains **NOT QUALIFIED**; these
results are not all-platform visual, accessibility or security certification.

The live protected host uses `.local/void-capabilities-20261022-n`, a new
development installation for the changed contract and schema. Previous builds
and stores remain untouched. Initialization requires the owner's chosen identity
and a password of at least twelve characters; recovery is not implemented.
Only loopback is exposed. No commit, push, main-branch change or new stable tag
was made. Decisions and unfinished scope are recorded in the
[overnight delivery record](OVERNIGHT-2026-10-22.md) and [roadmap](ROADMAP.md).

## Declared workspace and shared toolbar checkpoint — 2026-10-21

Current live artifact: `build/void-declared-workspace`, served at
`http://127.0.0.1:4400/`. This checkpoint supersedes the live-host status in the
previous checkpoint below; it is not a new stable release or a global debt-free
qualification.

- Contract: `feeb6b55a0e51875b81347c9619db2bc5b80fc71738e95ad0ca866a0b7060e56`.
- Surface: `208c8b94b5ec4b14bf79bf5eaad4a42751d53393a888520651f503f9fc72203b`.
- Renderer: `f6be359b5f5765c347a273fa380d7256e4ad412478fbc9e0234dde6ef23995eb`.

The product now declares `WorkspaceView.leftDock` by referencing `NavigationView`.
The SDK requires that root View, validates its bounded composition, and uses the
single published navigation catalog. No dock means no navigation UI, shortcut or
reserved width. Unsupported root slots fail validation rather than being ignored.
The navigation title, page, calendar, transient and media viewer use the shared
toolbar identity owner and reading-guide inset. There is no product-specific title
offset. The undeclared disabled Settings placeholder is absent from VOID; the
legacy public catalog explicitly retains its placeholder.

Executed on Node 24.16.0:

- **27/27 VOID contract/module/runtime tests pass**, with 27 admitted declaration
  files and passing TypeScript (`npm run check`).
- **30/30 built browser tests pass**, without skipped, cancelled or todo tests
  (`VOID_WEB_BUILD=build/void-declared-workspace npm run test:web`, 106.1 seconds).
  Coverage includes Notes, Media, delayed images, controller availability,
  responsive surfaces, real scrolling, search overlays and toolbar scroll-to-top.
- Focused SDK contract, workspace-runtime, toolbar identity/alignment and visual
  boundary suites pass. Headed-browser workspace tests cover declared navigation
  and no-dock behavior. SDK TypeScript and generated authoring-reference checks pass.
  The migrated closed-boundary gate passes; legacy visual ownership remains
  **NOT QUALIFIED**. The complete SDK suite was not rerun for this increment.
- Live browser verification measured the navigation title and content guide at
  the same x-coordinate: 32 CSS px, a delta of **0 px**. The previous live artifact
  measured title 21 px against content 32 px. Media navigation was verified on
  the updated host, not only on an isolated test fixture.

The first browser run exposed four obsolete media-counter selectors after the
viewer adopted the shared toolbar subtitle. Those test selectors were migrated;
their existing count/loading/focus assertions were retained. The focused Media
suite passed 7/7 before the full 30/30 run above. Two prebuilt legacy public-catalog
fixtures were rejected before render as `INVALID_PUBLIC_CATALOG_SURFACE`; they do
not qualify as passing browser checks for those historical artifacts.

The live host now uses `.local/void-declared-workspace`, a fresh development store
for the current contract. The old `.local/void` store was left intact: it belongs
to the older canonical contract and was neither deleted nor repinned. No commit
or push was made. General authored side docks, production identity and Capibara's
conditional/multi-step/assigned dynamic journeys remain separate open work; the
latter is a proposal, not an implemented executable contract.

## Unified contracts checkpoint — 2026-10-21

This increment closes the duplicate composed-surface navigation and presentation
declarations, public string-reference lookup, and preparation-response disclosure
described below. It is not a claim that every SDK feature or legacy visual owner
is complete. Product declarations remain separate from execution and rendering.

Current artifact: `build/void-unified-contracts-b`.

- Contract: `feeb6b55a0e51875b81347c9619db2bc5b80fc71738e95ad0ca866a0b7060e56`.
- Surface: `208c8b94b5ec4b14bf79bf5eaad4a42751d53393a888520651f503f9fc72203b`.
- Renderer: `c9475d5ce6fecea8504079180cc51676e5a1e51eef473a91576a6aac8265ed27`.

Executed on Node 24.16.0:

- **27/27 VOID contract/module/runtime tests pass**, with 25 admitted declaration
  files and passing TypeScript (`npm run check`, 17.9 seconds).
- **30/30 browser tests pass** on this artifact, with no skipped/cancelled/todo
  tests (`VOID_WEB_BUILD=build/void-unified-contracts-b npm run test:web`,
  111.8 seconds). Coverage includes Notes creation/read/edit, controller
  availability, Media/viewer navigation, delayed images, responsive panes,
  toolbar search/scroll, shared glass and navigation during a held post-save read.
- **1096/1096 SDK tests pass**, with no failures, skipped, cancelled or todo tests
  (`node --test --test-concurrency=2 --test-timeout=30000 tests/*.test.ts`,
  592.5 seconds). Production and fixtures remained frozen during this final run.
  Its preceding run was interrupted after finding an incomplete multi-object
  test fixture (`card.title` and `card.body` lacked required representations).
  That fixture and a missing fixture label were explicitly migrated; all 31
  affected tests and TypeScript passed before restarting. No production fallback
  or source change was needed to repair the fixtures.
- SDK TypeScript and generated authoring references pass. The no-new-debt and
  migrated closed-boundary checks pass, without resetting the visual baseline.
- The current renderer revision exactly matches the verified artifact above.
- All 146 local links in the SDK/VOID anatomy documents were checked; none are
  broken. The descriptions were reconciled with the actual declarations.

The new neutral field representation contract deliberately changes the canonical
digest. `fieldKinds` is derived output metadata, never another authored owner;
it permits complete representation/type validation after JSON serialization.
Read-only paragraphs need no mutation. Old `inputs` maps, incomplete metadata,
unsupported combinations, copied module references and competing navigation are
rejected rather than resolved by compatibility fallbacks.

Human and agent preparation share the same visibility ceiling approved by the
owner. Independent authenticated HTTP/PostgreSQL tests verify projection,
complete stored effects, confirmation digests and idempotent receipts, including
aliases and input-free operations. The interaction protocol is centrally owned
at `desert.interaction/7`. Wire validation establishes coherence, not authenticity;
execution authority stays with the controller.

No Svelte component, CSS, geometry or motion was changed in this increment. The
two emitted CSS files have identical bytes to `build/void-reference-owners-a`.
This is bounded evidence, not a new all-platform pixel-parity qualification.
The strict global visual ownership audit remains unqualified; general authored
side-dock Views, generic multi-step activities, production identity and common
remote MCP/API navigation remain separate open work documented in the anatomy.

The live 4400 host was not restarted, repinned or reset by this increment.
Browser tests use disposable isolated hosts and databases. No commit, push or
new stable release was made. See [VOID anatomy](ANATOMY.md),
[SDK anatomy](../../desert/docs/architecture/ANATOMY.md) and the
[prepared-response finding](../../desert/docs/BANK-SECURITY-FINDING.md).

## Historical intermediate work — 2026-10-21

The current increment closes composed exposure/navigation duplication, replaces
module string lookups with public object-reference catalogs, and applies one
preparation-response projection to human and agent surfaces. The owner explicitly
approved the agent restriction: only that surface's published reads and the
current operation's input assignments may contribute response facts; ownership
and unrelated internal facts are excluded.

Field presentation is now a complete neutral `fieldRepresentations` contract,
not a form-input map. Read-only paragraphs do not require a mutation. The old
canonical `inputs` grammar is rejected rather than silently migrated. This
intentional canonical change supersedes the exact-digest preservation result of
the earlier reference-only migration below. Current VOID contract digest:
`feeb6b55a0e51875b81347c9619db2bc5b80fc71738e95ad0ca866a0b7060e56`.
The interaction protocol has one owner at `desert.interaction/7`.

The intermediate `build/void-reference-owners-a` passed **30/30** browser cases,
including the deterministic held-response post-save race regression. It predates
the response-projection and neutral-representation migration and is not final
evidence for those changes. A subsequent complete SDK run was deliberately
interrupted when the owner approved the agent boundary; three observed stale
expectations were corrected and passed in focused checks. That interrupted run
is not a complete-suite pass. Fresh frozen-source checks remain required.

Source has changed since the frozen builds below. The ongoing architecture
work is not yet a new complete-suite pass, stable release or preview review
milestone. The latest in-progress complete SDK run reported **1011/1012 passing**;
the one failure came from unfinished new catalog-test TypeScript fixtures included
by the type-guarantees test. Those fixtures are now migrated into the normal suite;
a fresh frozen-source run is still required. Earlier intermediate runs reported
**977/979** and **980/981**, with obsolete fixtures and visual inventory reconciliation
failures; their focused corrections do not retroactively turn those runs green.

The single-navigation-owner build `b` passed **29/29** browser cases. Build `c`
then passed **28/29** and exposed an intermittent post-save navigation defect:
Media's enabled click was ignored while the prior mutation awaited its read refresh.
A held-response reproduction confirmed the race; the shared mutation owner now
releases only its own lock after receipt validation. A deterministic browser
regression and model tests cover it. Fresh artifact verification remains pending.

Current VOID source checks pass all **27/27** contract/module/runtime cases and
admit **25** declaration files. The object-reference migration preserves exact
VOID `definition`, `viewProgram`, derived `catalog` and `storyboard` values and
the navigation-only contract digest
`10e5f27ab77012fa4e42341fcd60f616792e8effd2d81cc4ccc7b45969861a1f`.
No UI geometry, material or motion source was changed by this increment.
The no-new-debt and migrated-closed-boundary checks pass; strict global visual
ownership remains unqualified. These checks do not certify every legacy owner.

An earlier complete SDK run reported **894/899 passing**:
three generated-reference freshness failures, one stale panel-media rejection
expectation, and one visual-build test whose fake empty contracts were rejected
by the newly enforced gateway before its intended mutation. The latter two were
corrected and their focused suites passed; references will be regenerated after
source freeze. This does not replace a fresh complete run.

The owner explicitly authorized discarding the disposable notes/identity store.
The exact `.local/void` directory was removed after its host stopped; build `f`
was started on port 4400 against a fresh store. Stable artifacts, source and media
assets were retained. This was an authorized test-data reset, not a migration or
an automatic deployment of subsequent source changes. No commit/push was made.

## Historical checkpoint: canonical toolbar and sealed View route — 2026-10-21

This was the verified source increment at build `f`, not a newly approved stable
release or global architecture qualification. It supersedes the earlier test
checkpoints below without erasing their failures.

The isolated `build/void-architecture-f` artifact has contract digest
`343f8e980a45314924df6bfa7b1c26fe1bd451112fbf1eafaad8951cc818cf53`
and renderer revision
`7c59905ec1ffc5916f16310a2e49ae299489d5d7423f4aa0cc3bd4db901da268`.
The SDK source remained frozen during its build and the final complete test run.

Executed on Node 24.16.0:

- **874/874 SDK tests pass**, with no failures, skipped, cancelled or todo tests
  (`npm test`, 838.4 seconds). SDK TypeScript and generated authoring-reference
  checks also pass.
- **25/25 VOID contract/module/runtime tests pass**; product source admission
  validates all 24 declaration files before evaluation, and TypeScript passes
  (`npm run check`).
- **29/29 VOID browser tests pass** on build `f` (85.4 seconds), using
  `VOID_WEB_BUILD=build/void-architecture-f npm run test:web`. They cover durable
  Notes creation/read/edit, published title/action availability, controller
  disconnection, Media/viewer navigation, delayed images, search overlays,
  scrolling, shared glass and responsive panel entry.
- The real generated Svelte build checks component types before Vite output.
  The migrated visual-boundary gate and no-new-debt gate both pass independently
  of the full suite. They are bounded checks, not global qualification.
- The two anatomy documents contain 113 verified local links. Their module,
  publication, execution-role and renderer-path descriptions match actual source.

The owner-approved page geometry is now the single toolbar rule: 8px inset,
12px gap and minimum 44px target, with one shared text-enlargement formula.
Sidebar, calendar, transient/message and viewer consumers no longer redefine it.
Ancestor padding is included in pane-relative verification. Six page/search
comparisons at 320/390/1280px have zero changed pixels; the wide page comparison
excludes the sidebar whose spacing was explicitly authorized to change. This is
bounded Chromium evidence, not full-product or native-platform pixel parity.
Evidence: SDK `artifacts/toolbar-canonical-geometry/geometry-delta.json`.

The active View route uses the typed catalog gateway and existing owners.
Required adapters, finite registry dispatch, owner prop types and the generated
theme bootstrap are checked before build output. Independent negative tests
reproduced and now reject CSS-import query/hash variants, function/class
shadowing of catalog imports, fabricated dispatcher capabilities and direct DOM
mutation through returned focus handles. Moving markup into a catalog owner is
not treated as proof that its complete dependency graph is qualified.

Shared focus lifecycle tests also reproduced and corrected the early outside-
focus race and parent closure with a portaled popover or sheet child. Restoration
waits for the descendant's real scope teardown, preserves explicit cancellation
and outside focus destinations, and adds no timer, CSS or replacement animation.
The final complete suite includes these cases and the preserved workspace,
media/inspection, search and transient parity checks.

Earlier evidence remains historical: one intermediate complete run reported
852/859 passing, with stale generated references, source-revision drift,
detached-outro measurement, the old stylesheet-import assertion and the real
selection focus race. Those failures were investigated rather than counted as
passing. A subsequent run was intentionally interrupted to correct independently
reproduced guard/focus defects; it is not complete-suite evidence. The frozen
874/874 run above is the final result for this increment.

The strict global visual audit still rejects qualification: **394 syntactic
findings across 362 files and six qualification gaps**. These are not 394
distinct confirmed consumer bugs. Historical findings were not replaced with a
new passing baseline. The complete private-owner/CSS/dependency graph, authored
navigation grouping, arbitrary side-dock Views, generic multi-step activities and
common cross-surface navigation remain open. Native renderers, production
identity bootstrap and MCP transport are not implied by these passing tests.

All browser writes use isolated disposable hosts. The owner's 4400 preview still
runs `build/void-media-recovery-b` with the original `.local/void` identity/store.
It was not restarted, repinned, reset or migrated. Edit changes the contract and
is not installed on that existing store without a safe migration. No commit,
push or new stable release was made. See [VOID anatomy](ANATOMY.md),
[SDK anatomy](../../desert/docs/architecture/ANATOMY.md) and the
[ownership audit](../../desert/docs/architecture/VISUAL-OWNERSHIP-AUDIT.md).

## Earlier checkpoint: architecture increment and safe editing — 2026-10-21

The current declarations mount Notes, Media and Visual catalog through one
product root. Typed ports and definition references replace duplicated authoring
names. Note publishes its detail View, title fact and Edit action once; toolbar
projection and storyboard consume that publication. Canonical execution, View
bindings, controller authority and catalog rendering remain separate layers.
The [product anatomy](ANATOMY.md) and [SDK anatomy](../../desert/docs/architecture/ANATOMY.md)
map the actual files and distinguish supported behavior from open requirements.

The isolated `build/void-architecture-c` artifact has contract digest
`343f8e980a45314924df6bfa7b1c26fe1bd451112fbf1eafaad8951cc818cf53`.
Adding the real Edit command deliberately changes the previous create/read digest;
it does not silently rewrite or replace an existing installation.

Executed on Node 24.16.0 with source frozen during the checks:

- Product source boundary: 24 declaration files; TypeScript passes.
- All 25 VOID contract/module/runtime tests pass. Editing preserves record
  identity, enforces the original authorized revision and ownership, and retries
  the original acceptance without producing a second write.
- All 29 browser tests pass on build `c`. The new cases exercise the published
  object title, the shared create/edit View and Edit availability after actual
  controller disconnection without replaying a write. Existing Notes, Media,
  toolbar search, scrolling, material and responsive entry checks remain green.
- Generated Svelte checking reports zero errors and zero warnings. SDK TypeScript
  checking passes; its focused client/edit/recovery/multiple-scope set passes 82 tests.
- The complete SDK run reports **773 passing and 2 failing of 775 tests**, not a
  green suite. The failures are an anchored-surface measurement during its starting
  state and a reproduced repeated-autofocus race in a nonmodal popover. The latter
  is an actual focus defect, not permission to weaken its keyboard assertion.

The strict visual ownership audit still fails: 420 syntactic findings across
348 inspected files, with six qualification gaps. These are not 420 distinct
consumer bugs. The bounded migrated-family and no-new-debt checks pass but do
not establish global closure. Toolbar geometry conflicts, open internal visual
contracts, general side-dock composition and common cross-surface navigation
remain explicit work; a production MCP/native implementation is not claimed.

All browser writes use isolated disposable hosts. The owner's 4400 preview
continues to run `build/void-media-recovery-b` with the existing `.local/void`
identity/store. It was not restarted, repinned, reset or migrated in this increment.
The new Edit build is not installed there. No commit or push was performed.

## Media restoration alongside Notes — 2026-10-21

`build/void-media-recovery-b` adds the typed Media module to the existing VOID
workspace. It restores 21 locally bound reference photographs, seven albums,
three featured album covers, the shared photo viewer and toolbar search overlay.
No private product renderer, CSS, primitive variant or controller was added.
The canonical Notes domain digest remains
`fcf9e7012a443c276aac2c121e7a85d81a8ce31b88be60978a6d15743b628d1c`.

Independent RED: the new navigation acceptance case failed on
`void-n2-toolbar-return-b` with `Missing navigation destination: Media` before
the module and fixture media binding were installed. The first new build `a`
was rejected by the renderer-revision guard after concurrent SDK edits; it is
not behavioral evidence. Fresh build `b` is the tested artifact.

Executed on Node 24.16.0:

- Product source boundary: 21 declaration files; TypeScript passes.
- All 21 contract/module/runtime tests pass, including isolated PostgreSQL
  ownership, exact facts, acceptance idempotency and restart persistence.
- Generated VOID Svelte checking reports zero errors and zero warnings.
- All 27 browser tests pass on build `b`. Seven new Media cases cover module
  navigation, albums, viewer controls, 390/1600px geometry, overlay selection,
  focus return, silent delayed images and preservation of a created note across
  Media/viewer navigation and browser reload. Existing Notes, glass, scrolling,
  transient entry, search and toolbar-return tests remain green.
- Five targeted Media cases were rerun after strengthening the album-focus and
  delayed-response assertions; all pass. The delayed response finishes before
  checking that its image cannot replace the current selection.

The search cases initially used an exact accessible title without the shared
row's description; the selectors were corrected to the canonical result ID.
This was a test-locator correction, not a product behavior change.

Browser tests create their own temporary host/database, never the owner's
`.local/void` store. Local screenshots are under `.local/web-evidence/` and are
not publishable sample-photo assets. Original media and derivatives remain
external to the VOID web artifact; its host receives explicit asset bindings.
No live-server replacement or owner-store write was performed by these tests.

After those checks, the task-owned 4400 server was gracefully replaced with build
`b` using the same `.local/void` identity and store. The prior, current and new
build domain digests were compared and matched before replacement; no repinning
or data migration occurred. Live browser inspection confirmed both existing
Untitled notes, Media navigation, album selection, photo paging and focus return.
The preview was left on Media. Live evidence: `.local/web-evidence/media-live-restored.png`.

This establishes local photo browsing alongside durable Notes create/read.
Video/music playback, imports, a persistent managed media library, native
platforms and full pixel-parity qualification are not claimed by these checks.

## Background-relative toolbar fade — 2026-10-20

The 4400 preview now runs `build/void-n2-toolbar-fade-a` against the unchanged
`.local/void` store. DESERT's shared edge fade uses the page background instead
of black, without product styling or geometry/motion changes. This intentionally
changes edge pixels; it is not a claim of whole-image equality.

All 17 browser tests pass on this build. Seven SDK fade/reading tests pass after
independently reproducing the previous color shift. Search/sidebar/transient
motion matches the previous build in all 12 comparisons. All 20 static pairs
have identical recorded geometry/scroll/toolbar metrics; visual differences
are the approved edge tint and its glass sampling, plus the previously recorded
eight Home-icon corner pixels in one comparison. Both appearances were visually
inspected. Reports: DESERT `artifacts/toolbar-fade-{motion,static}-20261020-a/`.
Live capture: `.local/web-evidence/toolbar-fade-4400-live.png`.

The frozen 4292 preview is untouched. No note was created in the owner's store.

## Responsive entry and primary glass — 2026-10-20

`build/void-n2-pane-motion-a` is running on the existing 4400 preview with the
original `.local/void` identity/store. The stable 4292 preview and older build
directories remain unchanged. No notes were added to the owner's store during
verification; browser write tests use isolated disposable stores.

The correction belongs to DESERT's shared owners, not a Notes style override:

- A newly mounted panel measures its host before choosing its entry axis.
  First/reopened panels enter from below at 390px and from the right at
  1200/1600px. The existing adaptive layout, curves and timing remain unchanged.
- Primary actions tint the same 88%-opacity, 24px-blur pane used by neutral
  buttons, wells and surfaces. Save note has a primary face and white label,
  retaining its geometry and emphasis while pending. Shared feedback remains
  perceptible without introducing a primary-colored hover on neutral buttons.
- Disabled search dims content once, leaving its glass and perimeter unchanged.
  Reduced-transparency/high-contrast accessibility fallbacks are preserved.

Executed on the rebuilt artifact: all 17 web tests pass, including four new
Notes material checks at 390/1600px in light/dark, existing durable create/read,
resize/draft retention, actual scroll and toolbar-only overlay search. All 19
contract/runtime tests and both repository TypeScript checks pass; generated
Svelte checking reports zero errors and warnings. SDK regression coverage adds
22 entry/lifetime/resize/motion/picker checks and focused material/feedback tests.

Preservation comparison against the previous `void-n2-search-overlay-c` build:
12/12 exact motion comparisons; 19/20 exact static pairs. The final wide/dark/
scroll pair differs only in the same eight Home-icon corner pixels previously
reproduced by a 4400-versus-itself control; geometry metrics are identical.
No tolerance or mask was used; full-matrix exact pixel parity is not claimed.
Reports live under DESERT `artifacts/pane-{motion,static}-parity-20261020-a/`.
Local captures live in `.local/web-evidence/notes-primary-glass-*.png` and
`pane-motion-4400-live.png`.

The live browser was reopened on the empty New note editor; no save was invoked.
This slice does not add experimental refraction, native-platform qualification
or finish the independent architecture/consumer-override audit.

## Capability-module migration — 2026-10-20

The product now has one `src/void.product.ts` root, Notes and Visual catalog
module manifests, and colocated object/command/journey/View declarations.
The SDK derives the domain product, View program, catalog and storyboard.
The parallel root product/experience files and manual View registry are removed.

`npm run check` passes the source boundary (17 declaration files), TypeScript
and all 19 contract/module/runtime tests on Node 24.16.0. The filesystem
expectation was executed RED before moving source, then GREEN afterward.
The derived composition tests were added with independent expectations; their
first execution passed, so no behavioral RED is claimed for those product tests.

The checks establish:

- The domain digest remains exactly
  `fcf9e7012a443c276aac2c121e7a85d81a8ce31b88be60978a6d15743b628d1c`.
  Existing stores do not require repinning, resetting or record migration.
- The derived inventory has two modules, five Views, four visual journeys and
  the one canonical create command. Home and Notes invoke the same activity.
- Notes mounts without Home or Visual catalog. Both modules explicitly publish
  reusable View contracts. Publishing them or journeys does not make the
  private Note object public; wrong-kind View references fail statically and
  at runtime.
- The existing real PostgreSQL tests still preserve private ownership,
  canonical inputs, one acceptance/receipt and restart persistence.
- Build, host and inspection entrypoints run the SDK source check before
  dynamic product imports. `npm run inspect` exposes derived declarations only,
  never stored notes, credentials or command execution.

No product UI, primitive CSS or motion definition changed in this migration.
The original store, identity, IDs and stable build directories are preserved.
After verification, the existing 4400 preview was restarted with
`build/void-n2-modules-a` against the same `.local/void` store. The frozen 4292
preview was not changed. No test note was inserted into the owner's store.

New-build verification, not inherited from the prior checkpoint:

- Seven real-browser tests pass: durable create/read, reload, empty titles,
  right-dock/transient draft retention, catalog isolation, wheel scrolling and
  intermediate entry motion. Tests use separate disposable stores.
- Generated Svelte check: zero errors and warnings. Both repository TypeScript
  checks pass. SDK module/source enforcement passes 44 focused cases; the wider
  View/closure/reuse run passed 91 cases before the final additional command
  deduplication case, which was separately rerun with all 12 module tests.
- Motion comparisons against approved VOID: 12/12 exact timing, keyframes and
  computed-paint comparisons. Evidence:
  `desert/artifacts/module-void-motion-20261020-a/`.
- Static comparison: 18/20 exact pairs. The two wide/scroll pairs differ by
  eight corner pixels in the Home sidebar icon. A 4400-versus-itself control
  reproduces the eight-pixel difference (19/20 exact after correcting the
  dialog selector). Twelve additional fresh-context probes show two persistent
  Chromium rasterizations per theme, each unchanged after 2/12/40 frames.
  No pixel masks, tolerances, styling or icon changes were introduced to make
  the test pass. Exact full-matrix pixel parity is therefore **not claimed**.
  Evidence: `desert/artifacts/module-void-parity-20261020-a/` and
  `desert/artifacts/module-void-parity-self-20261020-b/`.
- All files under DESERT `src/svelte`, `src/interaction`, `src/views` and
  `src/web` are unchanged from `v128a-stable`. The user's browser was reopened
  on Visual catalog and its existing identity session restored.

This closes the current slice's module registration/filesystem composition,
not safe editing, arbitrary multi-step activities, cross-module data/event
protocols, production Identity, MCP/API adapters, native releases or Media.
The global renderer ownership audit is still separate from this source gate.

## Preserved renderer repair — 2026-10-20

The original `void-notes-n1c` preview was visually rejected. Its runtime checks
did not establish parity with the approved UI. The repaired
`build/void-n1-preserved-c` uses DESERT's existing `CatalogWorkspace` and
`PublicCatalogBank` owners rather than a parallel workspace or specimen bank.
The canonical product digest below is unchanged.

- Final reference build `landmarks-v128-preservation-c` versus frozen v127a:
  20/20 exact pixel pairs, zero differing pixels, no masks or tolerances.
  The matrix covers 390×844/1280×900, light/dark, initial bank, real-wheel scroll,
  search, sidebar and transient states.
- Search, sidebar and transient motion: 12/12 exact comparisons of actual
  transition timing, keyframes and computed paint at five progress points.
- Seven VOID browser tests pass against the repaired final build: durable
  create/read, empty-title preservation after reload, one draft across
  right-dock/transient resizing, cancellation, isolated catalog navigation,
  real-wheel scrolling at both widths and intermediate first-entry motion.
- TypeScript passes in both repositories. The generated Svelte application has
  zero errors and zero warnings. The 12 VOID runtime tests and 36 focused SDK
  View/runtime/closure/search/compatibility checks also passed during this repair.
- Independent RED checks preceded the scroll, panel-entry, top-dock-action and
  retained-parent-activity fixes. The primitive CSS and approved motion were not
  redesigned to satisfy the tests.

Evidence lives in DESERT's `artifacts/stable-parity-v128-final-c-20261020/` and
`artifacts/stable-motion-v128-final-c-20261020/`, with the harness and limits in
`scripts/visual-parity/README.md`. VOID browser captures are under
`.local/web-evidence/`. The new local preview is `http://127.0.0.1:4400/`; the
approved 4292 preview remains unchanged. The original `.local/void` identity and
PostgreSQL store are preserved; write tests use disposable isolated databases.

The pixel comparison uses identical reference content on both builds. VOID has
its own labels and the SDK's original notebook illustration instead of Apple's
Landmarks photos. Those content differences are not claimed pixel-identical.
The catalog still mounts the same 23-component/57-fixture implementation.

This is a finite local Chromium qualification, not native Safari/VoiceOver,
all-platform parity, full-suite green, or completion of the 326-file ownership
audit. Editing, general capability-module integration, production identity
onboarding, real MCP/API transport, native releases and Media remain open.

## Historical local N1 web slice — visually rejected

Build `build/void-notes-n1c` runs Home, Notes and Visual catalog through the
DESERT View program interpreter and shared web catalog. VOID supplies typed
declarations, not Svelte components, CSS or an alternative controller.
The canonical product digest is
`fcf9e7012a443c276aac2c121e7a85d81a8ce31b88be60978a6d15743b628d1c`.
This evidence applies to the working branches, not an immutable release.

- VOID TypeScript and all 12 unit/runtime tests pass.
- All four real-browser acceptance tests in `tests/web/` pass against n1c.
  They cover create from Home and Notes, independent durable readback, untitled
  and multiline notes after reload, the same draft across right-dock/transient
  resizing, cancellation without writes, and catalog navigation without command
  preparation or acceptance. No browser page or CSP errors were observed.
- The generated Svelte application reports zero errors and zero warnings.
- DESERT's 51 focused View program/runtime and canonical recovery/read checks
  pass. Eleven adaptive-picker, material and transient-footer checks pass.
- Wide (1600 × 1000) and compact (390 × 844) screenshots were inspected for
  clipping and shared toolbar/form/footer alignment. They are local evidence
  under `.local/web-evidence/`, not native accessibility qualification.

The browser tests first exposed a real shared adaptive-dialog defect: a panel
that docked after mounting retained Bits UI's initial modal pointer lock.
The fix belongs to the SDK dialog bridge and reuses the installed Bits scroll
lock without remounting the form. A pinned compatibility check and the build/test
harness share one resolver. Wide-sidebar interaction before and after compact
presentation is now an explicit acceptance assertion.

The full SDK suite is **not green**: an integration run reported 575 passing
and 12 failing tests out of 587. Some failures were generated-reference/style
admission maintenance subsequently addressed. A focused audit confirms six
older feedback expectations still demand blue hover or `.985` press scale,
although stable v127a already uses neutral hover and `.96`. A floating-pane
focus case fails intermittently under concurrency and passes in isolation.
The broader audit remains open; this slice is not evidence of global closure.

The local host uses a persistent development identity and PostgreSQL store,
with a private one-use browser invitation. It is not production onboarding,
password authentication or recovery. Editing, collaboration, real MCP/API
transport and native releases remain outside this delivered slice.

## Historical local N1a follow-up

On 2026-10-20, the DESERT working branch adds the literal View contract on top of
the stable revision below. VOID now consumes it in `views/notes.view.ts`.
The original N0 result remains historical evidence for its exact source.

`npm run check` on the new working trees passes TypeScript and all 11 VOID tests:
the original 9 execution checks plus content/output authoring and rejection of
private style/journey properties. No tests were skipped. The final root run
took 11.578 seconds under Node 24.16.0.

DESERT additionally passes 30 focused View/Place/Bank/SurfaceFrame checks,
including 12 new runtime/static cases. These cover ordered content, required
Stack titles, constrained docks, output references, immutable definitions and
schemas, hostile JSON shapes, cycle/reference limits and invalid overrides.
An initial test-only readonly-cast type error was corrected before the passing
TypeScript run. Independent expectations preceded implementation review, but
the first executed contract run was already green; no behavioral RED is claimed.

The literal View is not rendered or bound to the existing Notes journeys.
The source is on development branches, not a new stable or native release.

## Original N0 baseline

Executed on 2026-10-20 on macOS using Node 24.16.0, TypeScript 5.9.3 and
PostgreSQL 18.6 (Homebrew).

Tested DESERT source revision:
`d0a50d2ca5119645c89cb5a4ec6cb227a38e9360` (`v127a-stable`).
The SDK working tree differed only in documentation during this check.
The relative dependency `file:../desert` does not enforce this source revision;
this is an evidence record, not a published or immutable dependency pin.

## Command and result

With Node 24 selected on PATH, from the VOID repository:

```sh
npm run check
```

Independent final run: TypeScript passed; **9 tests passed**, zero failed,
cancelled or skipped; test duration 8.588 seconds.

1. N0 exposes only the same create/read journeys to human and agent sessions.
2. The canonical input accepts present-empty title but not absent or fabricated fields.
3. Another identity cannot enumerate or read a private note through either exposure.
4. Revocation denies an already-admitted read and prepared acceptance without effects.
5. Human and agent sessions use the same create/read semantics, not an MCP transport.
6. Malformed input fails canonical preparation without a note or receipt.
7. An untitled note is written only on acceptance and projected without its owner.
8. Concurrent and subsequent acceptance of one intent returns one object and receipt.
9. Controller and isolated PostgreSQL restart retain note and original operation receipt.

Tests use temporary PostgreSQL clusters and independently inspect persisted
objects and receipts. They do not connect to existing product databases.
An earlier invocation under Node 20 failed to load TypeScript test files;
that runner does not meet this repository's Node 24 prerequisite.

## Not established

This is not evidence of a completed Notes vertical, UI, migrated Visual catalog,
safe editing, original edit-base checking, collaborative merge, participants,
labels, real MCP transport, remote API, native build, release pipeline or
cross-platform rendering parity. Media is a separate design requirement, not
part of these passing tests.

See [Notes acceptance](NOTES-VERTICAL.md) for the full target. Public reproduction
remains blocked on an accessible, separately licensed DESERT distribution.
