# Notes verification

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
