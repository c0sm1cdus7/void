# Visual enforcement checkpoint for external review

This source checkpoint is preserved for an independent visual-catalog enforcement
review. It is **not a declaration that the visual ownership requirement is met**.
The owner requested an external proposal first, then manual review, then approved
implementation by that agent. Feature expansion is not the immediate assignment.

## Repository pair

VOID is the public reference product at https://github.com/c0sm1cdus7/void.
DESERT is its separately maintained private SDK at https://github.com/c0sm1cdus7/desert.
Both handoff branches are `codex/module-architecture`; clone them as sibling
directories named `void` and `desert`. `package.json` uses `file:../desert`.
The external agent must have access to both repositories. Do not copy private
SDK implementation into this public repository.

The full handoff is in DESERT at
`docs/HANDOFF-VISUAL-ENFORCEMENT-2026-10-23.md`, followed by the four documents in
`docs/handoff/2026-10-23/`: REQUIREMENTS, FINDINGS, PLAN and OPERATIONS.
Use the exact commit pair supplied with delivery, not mismatched default branches.
This VOID checkpoint pairs with DESERT commit
`572b30fa981c8d2a27ce8846740f745bbb2721c8`. The
[pinned SDK handoff](https://github.com/c0sm1cdus7/desert/blob/572b30fa981c8d2a27ce8846740f745bbb2721c8/docs/HANDOFF-VISUAL-ENFORCEMENT-2026-10-23.md)
requires access to that private repository.

## Central requirement

The Visual Catalog is the exclusive set of approved visual building blocks:
Foundations and their Compositions. Product code may not draw its own UI, and SDK
compositions may not invent new blocks internally either. Registered/shared code
is not automatically approved. The visible catalog must expose the actual blocks
and states used by the product. The ordinary build must reject violations.

Current gaps include a noncanonical password field, composition-owned Appearance
selection cards/swatches/previews, direct lower-level control imports, incomplete
visual ownership checks and partial evidence previously treated as readiness.
The full independent review and concrete acceptance plan are in the SDK handoff.

## Product architecture and reading map

- Read `AGENTS.md`, `docs/MODULE-ANATOMY.md`, `docs/ANATOMY.md`, `docs/ROADMAP.md`
  and `docs/NOTES-VERTICAL.md` before changing product code.
- `src/void.product.ts` is the sole product composition root. `src/modules.ts`
  composes public module registrations/references. Do not import another module's
  implementation to construct Home or navigation.
- `src/modules/` owns Notes, Tasks/Projects, Media, System, Appearance, Identity
  and Visual Catalog declarations. `src/views/` supplies root compositions.
- Views use SDK-issued Components and typed ports; journeys bind execution and
  navigation. No product HTML, CSS, Svelte, renderer callbacks, controller or
  duplicated validators. Missing shared capability belongs in DESERT.
- Preserve private identity scope, safe create/edit/Trash/Restore, stale-edit
  rejection, exact-receipt recovery and no automatic replay after uncertain writes.
- Attention and Widgets replace per-module Home object lists. Appearance's latest
  design is Dark/Light preview choices, separate compact Text size, compact Tint,
  system-only wallpapers and a palette navigation icon. Those requirements still
  need structurally qualified catalog implementations.

Broader collaboration, task conversations, real environment/actor assignment,
provider provisioning, OAuth/recovery and native surfaces remain separate product
scope. Do not remove those requirements or pretend this enforcement task completes
them. Older documents may describe earlier media/project representations; inspect
the pinned module declarations and tests before stating support.

## Reproduction and preservation

Both repositories pin Node 24.16.0. Install DESERT dependencies before VOID using
the lockfiles. PostgreSQL binaries are required for isolated runtime tests; run
as a non-root OS user and use `DESERT_PG_BIN` or `pg_config` as appropriate.
Full source-checked commands and suite prerequisites are in the SDK OPERATIONS file.

From VOID, a fresh environment can use:

```sh
npm ci --ignore-scripts
npm run check
npm run web:build -- build/external-enforcement-baseline
VOID_WEB_BUILD="$PWD/build/external-enforcement-baseline" npm run test:web
```

Browser installation/setup is separate. These are commands to execute, **not new
passing results from this checkpoint**. The handoff operation did not run product
tests or a build. Existing historical evidence does not certify this revision.

Never commit identities, credentials, launch URLs, private uploads, runtime stores,
generated dependencies/builds, or Apple's sample media. Original generated assets
under `assets/media-samples` have their own source/provenance. Current registered
private-media views should not require the older Apple sample library, whereas
DESERT's separate Landmarks browser tests do require that external reference.

Use fresh test stores. Do not delete or repin an existing installation on contract
mismatch, replace protected previews, or use the owner's personal identity/data.
Keep the preserved v127a stable baseline. No production deploy or merge is implied.

## Requested external response

Return an independently justified enforcement proposal, mapping Appearance and
Lock to actual approved blocks, with build-negative cases, a complete ownership
strategy, migration order and honest limits. Wait for the owner's review before
implementing. After approval, return exact commit IDs and independent structural,
runtime and browser evidence; do not equate test counts with architectural closure.
